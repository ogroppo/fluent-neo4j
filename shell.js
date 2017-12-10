var inquirer = require('inquirer');
var obj = require('./index');

function query(){
	inquirer.prompt([
		{
			name: "query",
			message: ">",
			prefix: "nowl"
		}
	]).then(async answers => {
		var db = new obj();
		try {
			var res = await eval(answers.query);
			console.log("res", res);
		} catch (e) {
			console.log("e",e);
		}
		query();
	}).catch((e)=>{
		console.error(e.message);
		query();
	});
}
query();
