var util = require('util');
var ee = require('events');

var db_data = [
    { 'id': 1, 'name': 'Savchenko V. Y.', 'bday': '2001-05-31' },
    { 'id': 2, 'name': 'Shiman D. V.', 'bday': '1956-05-31' },
    { 'id': 3, 'name': 'Putin V. V.', 'bday': '1968-05-31' }
];

function DB() {

    this.commit = () => {

    }

    this.select = () => {
        return db_data;
    };

    this.insert = (request) => {
        let index = db_data.findIndex(x => x.id === Number(request.id))
        console.log(index);
        console.log(db_data);
        if (index === -1) {
            db_data.push(request);
        }
    };

    this.update = (newEl) => {
        console.log(newEl.id);
        let index = db_data.findIndex(x => x.id === Number(newEl.id));
        console.log(index);
        if (index !== -1) {
            db_data[index] = newEl;

            return true;
        }

        return false;
    };

    this.delete = (id) => {
        let index = db_data.findIndex(x => x.id === Number(id));
        console.log(index);
        if (index !== -1) {
            let elemArr = db_data[index];
            console.log(elemArr);
            db_data.splice(index, 1);
            return elemArr;
        }
    }
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;