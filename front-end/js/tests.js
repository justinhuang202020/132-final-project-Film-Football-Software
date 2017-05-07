let test;
function createAccount(email, confirmEmail, pass, confirmPass, callback) {

	//extract the values from the submit forms
	// Get the value from a dropdown select directly


	if (pass ===confirmPass && email ===confirmEmail) {

	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
		test = "success";
		callback("success");

	}, function(error) {

		var errorCode = error.code;
		var errorMessage = error.message;


		// alert(errorMessage);
		test = errorMessage;
		console.log(test);
		callback(test);

	});
}
else {
	test = "email or password doesn't match";
	console.log(test);
	callback(test);
	console.log("email or password doesn't match");
}
// callback();
}
// function foo(address, fn){
//   geocoder.geocode( { 'address': address}, function(results, status) {
//      fn(results[0].geometry.location); 
//   });
// }
console.log(test);

createAccount("totalwar20@gmail.com", "totalwar20@gmail.co", "ffffff", "ffffff", function(test) {
	console.log(test);
});
// let result = createAccount("totalwar20@gmail.com", "totalwar20@gmail.com", "ffffff", "ffffff"(test1);
// console.log(result)
;
console.log(test);

// });
let test1 = test;
console.log(test1);
createAccount("totalwar20@gmail.com", "totalwar20@gmail.com", "fffff", "ffffff", function(test) {
	console.log(test);
});
console.log(test);
let test2 = test;
console.log(test1);

let test3;
createAccount("totalwar20@gmail.com", "totalwar20@gmail.com", "ffffff", "ffffff", function(test) {
	console.log(test);
	test3 =test;
});
console.log(test);

console.log(test3);
QUnit.test( "hello test", function( assert ) {
	
  assert.equal(test1,"email or password doesn't match", "email doesn't match");
   assert.equal(test2, "email or password doesn't match", "password doesn't match");
   // //account has already been created
   assert.equal(test3,"The email address is already in use by another account.", "account has been created");
   //    assert.ok(createAccount("totalwar20@gmail.com", "totalwar20@gmail.com", "fffff", "fffff")!=="success", "password too short");
   //       assert.ok(createAccount("justin_huang@brown.edu", "justin_huang@brown.edu", "ffffff", "ffffff")==="success", "account has been created");


});