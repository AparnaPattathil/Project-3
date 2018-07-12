var express = require('express');
const Album = require('../models/album');
const Page = require('../models/page');
const config = require('../configs/index');
const passport = require('passport');

var router = express.Router();

// Route to get all albums
router.get('/', (req, res, next) => {
    Album.find()
    .then(albums => {
        res.json(albums);
    })
    .catch(err => next(err))
});


//Router to create new albums
router.post('/', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
    let{title} = req.body;

    Album.create({title, _pages:[], _owner: req.user._id})
    .then(album => {
        res.json({
            success:true,
            album
        });
    })
    .catch(err => next(err))
});

//Router to get all pages of an album
router.get('/:albumId',passport.authenticate("jwt", config.jwtSession), (req, res, next)=>{
    // TODO: find on Album instead of Page, and populate on _pages
    let albumId = req.params.albumId;
    console.log('albumId debug',albumId)
         Album.findById(albumId)
        .populate('_pages')
        .then(album =>{
        console.log("info of page",album._pages[0])
        res.json(album);
    })
    .catch(error => next(error))
});





//Router to create new page
router.post('/:albumId/pages', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
    let albumId = req.params.albumId
    const newPage = new Page({
        title: req.body.title,
        date: req.body.date,
        text: req.body.text
    });
    Album.findByIdAndUpdate(albumId, { $push: { _pages: newPage._id } })
    .then(_ => {
        newPage.save()
        .then(newPage =>{
            res.json({
                message: 'New page created!',
                id: newPage._id
            });
        })
        .catch(err => next(err))
    })
});


module.exports = router;