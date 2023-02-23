
const Intern = require('../models/Intern');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");//DDos

module.exports.index=async (req,res)=>{
    let tit="All Internships";
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search));
        const interns=await Intern.find({$or:[{title: regex},{location: regex}]});
        // console.log(interns.length);
        if(interns.length<1){
            tit="This Internship doesn't exist";
            res.render('interns/index',{interns,tit})
        }
        else{
            tit="Searched Internship"
            res.render('interns/index',{interns,tit});
        }
    }
    else{
        const interns= await Intern.find({});
        res.render('interns/index',{interns,tit});
    }
}

module.exports.renderNewForm=(req,res)=>{
    res.render('interns/new');
}

module.exports.createIntern=async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.intern.location,
        limit: 1
    }).send()
    const intern=new Intern(req.body.intern);
    intern.geometry = geoData.body.features[0].geometry;
    intern.author = req.user._id;
    await intern.save();
    req.flash('success', 'Successfully made a new opportunity!');
    res.redirect(`/interns/${intern._id}`)
}

module.exports.showIntern=async(req,res)=>{
    const intern=await Intern.findById(req.params.id).populate('reviews').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!intern) {
        req.flash('error', 'Cannot find that!');
        return res.redirect('/interns');
    }
    res.render('interns/show',{intern});
}

module.exports.renderEditForm= async(req,res)=>{
    const intern=await Intern.findById(req.params.id);
    if (!intern) {
        req.flash('error', 'Cannot find that!');
        return res.redirect('/interns');
    }
    res.render('interns/edit',{intern});
}

module.exports.updateIntern=async(req,res)=>{
    const {id}=req.params;
    const intern=await Intern.findByIdAndUpdate(id,{...req.body.intern});
    req.flash('success', 'Successfully updated Internship.');
    res.redirect(`/interns/${intern._id}`);
}

module.exports.deleteIntern=async(req,res)=>{
    const {id}=req.params;
    await Intern.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted.')
    res.redirect('/interns');
}

module.exports.about=(req,res)=>{
    res.render('interns/about');
}