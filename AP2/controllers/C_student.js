const { catchRes, successRes, errorRes } = require("./../res/msgcode");
const db = require('./../db/config');

const checkIfExists = async (column, value) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS count FROM students WHERE ${column}=? AND isDelete=0`;
        db.query(sql, [value], (err, result) => {
            if (err) {
                console.error('Error checking if value exists:', err);
                reject(err);
            } else {
                const count = result[0].count;
                resolve(count > 0);
            }
        });
    });
};

const display = async (req, res) => {
    try {
        const sql = 'SELECT id, name, email, mobile, address, age FROM students WHERE isDelete = 0 ORDER BY id DESC;';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                errorRes(res, 500, "Some Internal Error");
            } else {
                successRes(res, 200, "List of Students", result);
            }
        });
    } catch (error) {
        console.log("Error From Display function >>>", error);
        errorRes(res, 500, "Some Internal Error");
    }
};

const displayById = async (req, res) => {
    try {
        const id = req.params.id;
        if(!/^[0-9]+$/.test(id)){
            return errorRes(res, 404, "ID is not valid!");
        }
        let sql = `SELECT * FROM students WHERE id=${id} AND isDelete=0;`;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                errorRes(res, 500, "Some Internal Error");
            } else {
                if (result.length > 0) {
                    successRes(res, 200, "List of Students", result);
                } else {
                    return errorRes(res, 404, "No Student Found With Given ID.");
                }
            }
        });
    } catch (error) {
        errorRes(res, 500, "Some Internal Error");
        console.log("Error from the displayById function >>>", error);
    }
};

const addStudent = async (req, res) => {
    try {
        const { name, email, mobile, address, age } = req.body;

        if (!name) {
            return errorRes(res, 400, "Name is required");
        } if (/\s/.test(name)) {
            return errorRes(res, 400, "The name must not contain space");
        } if (!/^[a-zA-Z]+$/.test(name)) {
            return errorRes(res, 400, "Only characters are allowed in the name");
        } if (name.length < 3) {
            return errorRes(res, 400, "Name must contain at least 3 characters");
        } if (!email) {
            return errorRes(res, 400, "Email is required");
        }if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return errorRes(res, 400, "Email is Not Valid");
        }
        // Email already  exists or not
        const emailExists = await checkIfExists('email', email);
        if (emailExists) {
            return errorRes(res, 400, "Email already exists");
        }   
         if (!mobile) {
            return errorRes(res, 400, "Moblie Number is required");
        }if (!/^\d+$/.test(mobile)) {
            return errorRes(res, 400, "Moblie is not valid");
        } if (mobile.length != 10) {
            return errorRes(res, 400, "Moblie must be 10 digit");
        }
        // mobile  number already exists or not
        const mobileExists = await checkIfExists('mobile', mobile);
        if (mobileExists) {
            return errorRes(res, 400, "Mobile already exists");
        }
        
        if (!address) {
            return errorRes(res, 400, "Address is required.");
        }if(/^[0-9]+$/.test(address)){
            return errorRes(res,400,"Address can't be number only")
        }
        if(!/^[a-zA-Z0-9]+(?:[\s,-][a-zA-Z0-9]+)*$/.test(address)){
            return errorRes(res,400,"Invalid address")
        } 
        
        if (!age) {
            return errorRes(res, 400, "Age is required.");
        } 
        if(!/^[1-9]+$/.test(age)){
            return errorRes(res,400,"Age is not valid");
        }
        if (age <= 19 || age >= 66) {
            return errorRes(res, 400, "Age must between 18 to 65");
        }

        const sql = 'INSERT INTO students(name,email,mobile,address,age) VALUES(?,?,?,?,?)';
        db.query(sql, [name, email, mobile, address, age], (err, result) => {
            if (err) {
                console.error('Error executing MySQL query Insert:', err);
                errorRes(res, 500, "Some Internal Error");
            } else {
                let sql = `SELECT * FROM students WHERE id=${result.insertId};`;
                db.query(sql, (err, resu) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        errorRes(res, 500, "Some Internal Error");
                    } else {
                        successRes(res, 201, "Student is added Successfully", resu);
                    }
                });
            }
        });

        
    } catch (error) {
        console.log("error.message", error.message);
        return errorRes(res, 500, "Some Internal Error");
        
    }
};

const removeStud = async (req, res) => {
    try {
        const id = req.params.id;
        if(!/^[0-9]+$/.test(id)){
            return errorRes(res, 404, "ID is not valid!");
        }
        let sql = `SELECT * FROM students WHERE id=${id} AND isDelete=0;`;
        db.query(sql, (err, result) => {
            if (result.length < 1) {
                errorRes(res, 404, "No Student Found With Given ID");
            } else {
                db.query(`UPDATE students SET isDelete=1 where id=?`,id,(e, r) => {
                    if (e) {
                        errorRes(res, 500, 'Some Internal Error');
                    } else {
                        successRes(res, 200, "Student is removed successfully");
                    }
                });
            }
        });
    } catch (error) {
        console.log("Error From removeStud function >>", error);
        errorRes(res, 500, 'Some Internal Error');
    }
};

const updateStud = async (req, res) => {
    try {
        const id = req.params.id;
        if(!/^[0-9]+$/.test(id)){
            return errorRes(res, 404, "ID is not valid!");
        }
        let sql = `SELECT * FROM students WHERE id=${id};`;
        db.query(sql, async (error, resu1) => {
            if (resu1.length < 1) {
                errorRes(res, 404, "No Student Found With Given ID");
            } else {
                const existingStudent = resu1[0];
                const { name, email, mobile, address, age } = req.body;

                const updatedData = req.body;

                function checkFiled(data) {
                    const invalidKey = Object.keys(data).find((key) => !['name', 'email', 'mobile', 'address', 'age'].includes(key));
                
                    if (invalidKey) {
                        return { result: true, key: invalidKey };
                    } else {
                        return { result: false, key: null };
                    }
                }
                
                const result = checkFiled(updatedData);
                
                if(result.result == true){
                    return errorRes(res, 400, `Provided filed ${result.key} is not available in the database`);   
                }
                

                if (name && /\s/.test(name)) {
                    return errorRes(res, 400, "The name must not contain space");
                } if (name && !/^[a-zA-Z]+$/.test(name)) {
                    return errorRes(res, 400, "Only characters are allowed in the name");
                } if (name && name.length < 3) {
                    return errorRes(res, 400, "Name must contain at least 3 characters");
                } if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return errorRes(res, 400, "Email is Not Valid");
                }


                if (email && email !== existingStudent.email) {
                    const emailExists = await checkIfExists('email', email);
                    if (emailExists) {
                        return errorRes(res, 400, "Email already exists");
                    }
                }
                if (mobile && !/^\d+$/.test(mobile)) {
                    return errorRes(res, 400, "Moblie is not valid");
                }
                if (mobile && mobile.length != 10) {
                    return errorRes(res, 400, "Moblie must be 10 digit");
                }
                
                if (mobile && mobile !== existingStudent.mobile) {
                    const mobileExists = await checkIfExists('mobile', mobile);
                    if (mobileExists) {
                        return errorRes(res, 400, "Mobile number already exists");
                    }
                }if(address && /^[0-9]+$/.test(address)){
                    return errorRes(res,400,"Address can't be number only")
                }
                if(address && !/^[a-zA-Z0-9]+(?:[\s,-][a-zA-Z0-9]+)*$/.test(address)){
                    return errorRes(res,400,"Invalid address")
                }
                if(age && !/^[1-9]+$/.test(age)){
                    return errorRes(res,400,"Age is not valid");
                }

                if (age && (age <= 19 || age >= 66)) {
                    return errorRes(res, 400, "Age must between 18 to 65");
                }

                if (!updatedData || Object.keys(updatedData).length === 0) {
                    return errorRes(res, 400, "Provide data to update");
                }

                const setValues = Object.keys(updatedData).map((key) => `${key} = ?`).join(', ');
                const sql = `UPDATE students SET ${setValues} WHERE id = ?`;
                const values = [...Object.values(updatedData), id];

                db.query(sql, values, (err, resu2) => {
                    if (err) {
                        console.log('Error executing MySQL query update:', err);
                        return errorRes(res, 500, "Internal Server Error");
                    } else {
                        db.query('SELECT * FROM students WHERE id=?',id, (err2, results) => {
                            if(err2){
                                return errorRes(res, 500, "Internal Server Error");
                            }else{
                                successRes(res, 200, "Student Details is Updated successfully", results[0]);
                            }
                            
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log("Error in updateStud function:", error.message);
        return errorRes(res, 500, "Internal Server Error");
    }

};


module.exports = {
    display, displayById, addStudent, removeStud, updateStud
};
