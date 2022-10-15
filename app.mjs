// app.mjs
import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';

const app = express();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const sessionOptions = {
	secret: 'secrets of targaryen',
    saveUninitialized: true,
	resave: true
};
app.use(session(sessionOptions));
const dragons =[{dragonName:'Syrax', rider: 'Rhaenyra', identification: 'giant yellow-scaled dragon', house: 'Targaryen'},
{dragonName:'Caraxes', rider: 'Daemon', identification: 'large red dragon', house: 'Targaryen'},
{dragonName:'Seasmoke', rider: 'Laenor', identification: 'silver-gray dragon', house: 'Velaryon'},
{dragonName:'Meleys', rider: 'Rhaenys', identification: 'swift red and pink dragon', house: 'Targaryen'}];
app.set("view engine", "hbs");
app.use(express.urlencoded({extended: false}));
app.use(function(req, res, next){
    let cookiesHeader = req.get('Cookie');
    req.myCookie = {};
    if (cookiesHeader) {
        cookiesHeader = cookiesHeader.split(";").map(value => value.split('=')).reduce((last, current) => {
            last[decodeURIComponent(current[0].trim())] = decodeURIComponent(current[1].trim());
            return last;
        }, {});
        req.myCookie = cookiesHeader;
    }
    console.log('Request Method :', req.method);
    console.log('Request Path :', req.path);
    console.log('Request Query :', req.query);
    console.log('Request Body :', req.body);
    console.log('Request Cookies :');
    for(const [key, val] of Object.entries(req.myCookie)){
        if(key !== 'connect.sid'){
            console.log(key+'='+val);
        }else{
            console.log('connect.sid=[REDACTED]');
        }
    }
    next();
})
app.use(function(req, res, next){
    if(req.get("Host")===undefined){
        res.statusCode=400;
        res.statusMessage="Bad Request";
        res.contentType="text/html";
        res.charset="utf-8";
        res.send("Bad Request");
    }else{
        next();
    }
})
app.get('/', (req, res)=>{
    const House = req.query['House'];
    console.log('house is ', House);
    if (House) {
        res.render('index', {dragons: dragons.filter(dragon => dragon.house === House)});
    }
    else {
    res.render('index', {dragons: dragons});
}})
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000);