import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  // Type Definitions
  public type StudentClass = {
    #nursery;
    #juniorKindergarten;
    #seniorKindergarten;
    #grade1;
    #grade2;
    #grade3;
    #grade4;
    #grade5;
    #grade6;
    #grade7;
  };

  public type PaymentMode = { #cash; #bhim; #phonePe; #googlePay };

  public type StudentStatus = { #complete; #incompleteProfile };

  public type PaymentEntry = {
    date : Time.Time;
    amount : Nat;
    paymentMode : PaymentMode;
    receiptNo : Nat;
  };

  public type ParentRating = {
    rating : Nat; // 1–5
    review : Text;
    date : Time.Time;
  };

  public type StudentProfile = {
    id : Nat;
    name : Text;
    parentName : Text;
    surname : Text;
    fatherPhoneNumber : Text;
    motherPhoneNumber : Text;
    email : ?Text;
    studentClass : StudentClass;
    totalFee : Nat;
    status : StudentStatus;
    payments : [PaymentEntry];
    ratings : [ParentRating];
    isArchived : Bool; // New field for soft delete
  };

  module StudentProfile {
    public func compareByName(profile1 : StudentProfile, profile2 : StudentProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  // Persistent Maps and State
  var nextStudentId = 1;
  let persistentStudents = Map.empty<Nat, StudentProfile>();
  let pendingStudents = Map.empty<Nat, StudentProfile>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextReceiptNo = 1;

  // Authentication State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Core Features
  // Add Student Admission Functionality
  public shared ({ caller }) func addStudent(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add students");
    };
    persistentStudents.add(profile.id, profile);
  };

  public shared ({ caller }) func addPendingStudent(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add pending students");
    };
    pendingStudents.add(profile.id, profile);
  };

  public shared ({ caller }) func updatePendingStudent(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update pending students");
    };
    pendingStudents.add(profile.id, profile);
  };

  public shared ({ caller }) func makeStudentDataPersistent(profileId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can make student data persistent");
    };

    switch (pendingStudents.get(profileId)) {
      case (null) {
        Runtime.trap("Student not found");
      };
      case (?profile) {
        persistentStudents.add(profileId, profile);
        pendingStudents.remove(profileId);
      };
    };
  };

  // Add Payment Entry (with receipt number assignment)
  public shared ({ caller }) func addPayment(studentId : Nat, payment : PaymentEntry) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add payments");
    };

    let paymentWithReceipt = {
      payment with
      receiptNo = nextReceiptNo;
    };

    switch (persistentStudents.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedPayments = student.payments.concat([paymentWithReceipt]);
        let updatedProfile = {
          student with
          payments = updatedPayments;
        };
        persistentStudents.add(studentId, updatedProfile);
        nextReceiptNo += 1;
        paymentWithReceipt.receiptNo;
      };
    };
  };

  public shared ({ caller }) func addParentRating(studentId : Nat, rating : Nat, review : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add ratings");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Invalid rating. Must be between 1 and 5");
    };

    switch (persistentStudents.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let newRating : ParentRating = {
          rating;
          review;
          date = Time.now();
        };
        let updatedRatings = student.ratings.concat([newRating]);
        persistentStudents.add(studentId, {
          student with
          ratings = updatedRatings;
        });
      };
    };
  };

  public query ({ caller }) func getStudentRatings(studentId : Nat) : async [ParentRating] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ratings");
    };

    switch (persistentStudents.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student.ratings };
    };
  };

  public query ({ caller }) func getStudent(studentId : Nat) : async StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view student details");
    };

    switch (persistentStudents.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
  };

  public query ({ caller }) func getAllStudents() : async [StudentProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view all students");
    };

    persistentStudents.values().toArray().sort(StudentProfile.compareByName);
  };

  public query ({ caller }) func getAllPendingStudents() : async [StudentProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view pending students");
    };

    pendingStudents.values().toArray().sort(StudentProfile.compareByName);
  };

  // Soft delete (archive) student
  public shared ({ caller }) func archiveStudent(studentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can archive students");
    };

    switch (persistentStudents.get(studentId)) {
      case (null) {
        Runtime.trap("Student not found");
      };
      case (?student) {
        let updatedProfile = {
          student with
          isArchived = true;
        };
        persistentStudents.add(studentId, updatedProfile);
      };
    };
  };
};
