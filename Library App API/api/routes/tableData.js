const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tables/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace('/:/', '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }

};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});


const Table = require('../models/table');
console.log('running');
//handle GET requests to /textData
router.get('/', (req, res, next) => {
    console.log('running');
    Table.find().select('number description image availability floor floor_image table_image').exec().then(docs => {
        const response = {
            count: docs.length,
            tables: docs.map(table => {
                return {
                    table
                }
            })
        };
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', upload.single('image'), (req, res, next) => {
    console.log(req.body.image);
    if (!!req.body.availability) {

        Table.findOneAndUpdate({
                number: req.body.number
            }, {
                $set: {
                    availability: req.body.availability
                }
            }, {
                returnNewDocument: true
            },
            function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating record!");
                }
                console.log(doc);
            }).exec().then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });

    } else {
        const data = new Table({
            _id: new mongoose.Types.ObjectId(),
            number: req.body.number,
            description: req.body.description,
            image: req.file.path,
            availability: 1,
            floor: req.body.floor,
            floor_image: req.body.floor_image,
            table_image: req.body.table_image
        });
        data.save().then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Created data entry successfully',
                    createdData: {
                        number: result.number,
                        description: result.description,
                        image: result.image,
                        floor: result.floor,
                        floor_image: result.floor_image,
                        table_image: result.table_image,
                        _id: result._id,
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/tableData/' + result._id
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err + 'help');
                console.log('help2');
                res.status(500).json({
                    error: err
                });
            });
    }
});

router.get("/:number", (req, res, next) => {
    const id = req.params.number;
    Table.find({
            number: id
        }).select("number description floor availability floor_image table_image").exec().then(

            doc => {
                console.log("From database", doc);
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({
                        message: "No valid entry for id"
                    });
                }
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:number", (req, res, next) => {
    const id = req.params.number;
    Table.deleteOne({
            number: id
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;