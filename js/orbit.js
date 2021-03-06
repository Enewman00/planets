document.addEventListener("wheel", changeDate);
document.addEventListener("click", changeClick);
var testDate = new Date();
var click = false;
var runId;


function changeClick(e)
{
    click = !click;
    console.log(click);
    if (!click)
    {
        runId = setInterval(run, 0);
    }
}
// document.addEventListener('keydown', changeDate);
// function changeDate()
function changeDate(e)
{
    scrolled = true;
    // console.log(parseInt(e.deltaY));
    testDate.setDate(testDate.getDate() + parseInt(e.deltaY));
   

    renderForeground(testDate);
}



function resize()
{
    setCanvasSize();
    renderBackground();
    renderForeground(new Date());
}

//onload and onresize
function init()
{
    setCanvasSize();
    renderBackground();
    renderForeground(new Date());
    // testDate = new Date();
    runId = setInterval(run, 0);
}

function run()
{

    // var date = new Date();
    testDate.setDate(testDate.getDate() + 1);
    requestAnimationFrame(renderForeground);
    if (click)
    {
        clearInterval(runId);
    }
    // renderForeground();
    // renderForeground(date);

    //loop
    // setTimeout(run(), 100);
}

//draw planets, ui elements
function renderForeground()
{
    var foreground = document.getElementById("foreground").getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var innerScale = 50;
    var outerScale = 20;
    var saturnScale = 14;
    var uranusScale = 8.5;
    var neptuneScale = 6.3;
    
    //clear the foreground
    foreground.clearRect(0, 0, width, height);

    //get julian date
    var today = testDate;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var julianDate = getJulianDate(yyyy, mm, dd);
    //get julian centuries since epoch 
    var julianCenturies = (julianDate - 2451545.0) / 36525  //36535 is a julian century in julian days, 2451545 is julian epoch (Jan 2000)

    //Render Gregorian Date for Today
	foreground.font = "20px Arial";
	foreground.textAlign = "center";
	foreground.fillStyle = "dimgrey";
    foreground.fillText(yyyy +"."+ mm +"."+dd,window.innerWidth/2,window.innerHeight/1.3);
    foreground.fillText("Click to toggle pause",window.innerWidth/2,window.innerHeight/1.4);	
    foreground.fillText("Scroll to change date",window.innerWidth/2,window.innerHeight/1.5);

    //consts to get approx positon of mars
    //ELEMENTS @ J2000: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
    //RATES: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
    var MercuryElements = [0.38709843, 0.20563661, 7.00559432, 252.25166724, 77.45771895, 48.33961819];
    var MercuryRates = [0.00000000, 0.00002123, -0.00590158, 149472.67486623, 0.15940013, -0.12214182];
    var mercuryCoords = getPlanetCoords(julianCenturies, MercuryElements, MercuryRates);

    var VenusElements = [0.72332102, 0.00676399, 3.39777545, 181.97970850, 131.76755713, 76.67261496];
    var VenusRates = [-0.00000026, -0.00005107, 0.00043494, 58517.81560260,  0.05679648,  -0.27274174];
    var venusCoords = getPlanetCoords(julianCenturies, VenusElements, VenusRates);

    var EarthElements = [1.00000018, 0.01673163, -0.00054346, 100.46691572, 102.93005885, -5.11260389];
    var EarthRates = [-0.00000003, -0.00003661, -0.01337178, 35999.37306329, 0.31795260, -0.24123856];
    var earthCoords = getPlanetCoords(julianCenturies, EarthElements, EarthRates);

	var MarsElements = [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891];
    var MarsRates = [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343];
    var marsCoords = getPlanetCoords(julianCenturies, MarsElements, MarsRates);

    var JupiterElements = [5.20248019, 0.04853590, 1.29861416, 34.33479152, 14.27495244, 100.29282654];
    var JupiterRates = [-0.00002864, 0.00018026, -0.00322699, 3034.90371757,  0.18199196, 0.13024619];
    var jupiterCoords = getPlanetCoords(julianCenturies, JupiterElements, JupiterRates);

    var SaturnElements = [9.54149883, 0.05550825, 2.49424102, 50.07571329, 92.86136063, 113.63998702];
    var SaturnRates = [-0.00003065, -0.00032044, 0.00451969, 1222.11494724, 0.54179478, -0.25015002];
    var saturnCoords = getPlanetCoords(julianCenturies, SaturnElements, SaturnRates);

    var UranusElements = [19.18797948, 0.04685740, 0.77298127, 314.20276625, 172.43404441, 73.96250215];
    var UranusRates = [-0.00020455, -0.00001550, -0.00180155, 428.49512595, 0.09266985,  0.05739699];
    var uranusCoords = getPlanetCoords(julianCenturies, UranusElements, UranusRates);

    var NeptuneElements = [30.06952752, 0.00895439, 1.77005520, 304.22289287, 46.68158724, 131.78635853];
    var NeptuneRates = [0.00006447, 0.00000818, 0.00022400, 218.46515314, 0.01009938, -0.00606302];
    var neptuneCoords = getPlanetCoords(julianCenturies, NeptuneElements, NeptuneRates);

    //draw planets
    //mercury
    drawCircle((width / 2) + (mercuryCoords[0] * innerScale), (height / 2) - (mercuryCoords[1] * innerScale), 4, "lightgray", "foreground");
    //venus
    drawCircle((width / 2) + (venusCoords[0] * innerScale), (height / 2) - (venusCoords[1] * innerScale), 6, "#7a6400", "foreground");
    //earth
    drawCircle((width / 2) + (earthCoords[0] * innerScale), (height / 2) - (earthCoords[1] * innerScale), 6, "#007034", "foreground");
    //mars
    drawCircle((width / 2) + (marsCoords[0] * innerScale), (height / 2) - (marsCoords[1] * innerScale), 5, "red", "foreground");
    //jupiter
    drawCircle((width / 2) + (jupiterCoords[0] * outerScale), (height / 2) - (jupiterCoords[1] * outerScale), 12, "#ff6a00", "foreground");
    //saturn
    drawCircle((width / 2) + (saturnCoords[0] * saturnScale), (height / 2) - (saturnCoords[1] * saturnScale), 10, "#ffb785", "foreground");
    //uranus
    drawCircle((width / 2) + (uranusCoords[0] * uranusScale), (height / 2) - (uranusCoords[1] * uranusScale), 9, "#00e5ff", "foreground");
    //uranus
    drawCircle((width / 2) + (neptuneCoords[0] * neptuneScale), (height / 2) - (neptuneCoords[1] * neptuneScale), 9, "#005591", "foreground");
}

//get x and y for mars
function getPlanetCoords(julianCenturies, elements, rates)
{
    
    

    //ORBIT SIZE
	//AU (CONSTANT = DOESN'T CHANGE)
	var aGen = elements[0] + (rates[0] * julianCenturies);

	//ORBIT SHAPE
	//ECCENTRICITY (CONSTANT = DOESN'T CHANGE)
	var eGen = elements[1] + (rates[1] * julianCenturies);
    
    //ORBIT ORIENTATION
	//ORBITAL INCLINATION (CONSTANT = DOESN'T CHANGE)
	var iGen = elements[2] + (rates[2] * julianCenturies);
    var iGen = iGen % 360;

	//ORBIT ORIENTATION
	//LONG OF ASCENDING NODE (CONSTANT = DOESN'T CHANGE)
	var WGen = elements[5] + (rates[5] * julianCenturies);
	var WGen = WGen % 360;

	//ORBIT ORIENTATION
	//LONGITUDE OF THE PERIHELION
	var wGen = elements[4] + (rates[4] * julianCenturies);
	var wGen = wGen % 360;
    if(wGen < 0)
    {
        wGen = 360 + wGen;
    }	

    //ORBIT POSITION
	//MEAN LONGITUDE (DYNAMIC = CHANGES OVER TIME)
	LGen = elements[3] + (rates[3] * julianCenturies);
	LGen = LGen%360;
	if(LGen<0){LGen = 360+LGen;}	
	
	
	//MEAN ANOMALY --> Use this to determine Perihelion (0 degrees = Perihelion of planet)
	MGen = LGen - (wGen);
	if(MGen<0){MGen=360+MGen;}

	//ECCENTRIC ANOMALY
	EGen = EccAnom(eGen,MGen,6);
	
	//ARGUMENT OF TRUE ANOMALY
	trueAnomalyArgGen = (Math.sqrt((1+eGen) / (1-eGen)))*(Math.tan(toRadians(EGen)/2));

	//TRUE ANOMALY (DYNAMIC = CHANGES OVER TIME)
	K = Math.PI/180.0; //Radian converter variable
	if(trueAnomalyArgGen<0){ 
		nGen = 2 * (Math.atan(trueAnomalyArgGen)/K+180); //ATAN = ARCTAN = INVERSE TAN
	}
	else{
		nGen = 2 * (Math.atan(trueAnomalyArgGen)/K)
	}

    //Calculate radius vector
	var rGen = aGen * (1 - (eGen * (Math.cos(toRadians(EGen)))));

    //http://www.stargazing.net/kepler/ellipse.html
	//creds: Keith Burnett
    var xGen = rGen *(Math.cos(toRadians(WGen)) * Math.cos(toRadians(nGen + wGen - WGen)) - Math.sin(toRadians(WGen)) * Math.sin(toRadians(nGen + wGen - WGen)) * Math.cos(toRadians(iGen)));
	var yGen = rGen *(Math.sin(toRadians(WGen)) * Math.cos(toRadians(nGen + wGen - WGen)) + Math.cos(toRadians(WGen)) * Math.sin(toRadians(nGen + wGen - WGen)) * Math.cos(toRadians(iGen)));

    return [xGen, yGen];
}

//draw dark background and sun
function renderBackground()
{
    //set background color
    var background = document.getElementById("background").getContext("2d");
    background.fillStyle = "#090909";
    background.fillRect(0, 0, window.innerWidth, window.innerHeight);

    //create sun
    drawCircle(window.innerWidth / 2, window.innerHeight / 2, 10,"yellow", "background");
}




function getJulianDate(YearString, MonthString, DayString)
{
    var Year = parseFloat(YearString);
    var Month = parseFloat(MonthString);
    var Day = parseFloat(DayString);
    var inputDate = new Date(Year, Month, Math.floor(Day));
    var switchDate = new Date("1582", "10", "15");
    
    var isGregorianDate = inputDate >= switchDate;

    //Adjust if BC
    if (Year < 0)
    {
        Year++;
    }

    //Adjust if it's jan or feb
    if (Month == 1 || Month == 2)
    {
        Year = Year - 1;
        Month = Month + 12;
    }

    //Calculate A & B; ONLY if date is equal or after 1582-Oct-15
	var A = Math.floor(Year / 100); //A
	var B = 2-A+Math.floor(A / 4); //B
	
	//Ignore B if date is before 1582-Oct-15
    if(!isGregorianDate)
    {
        B = 0;
    }
					
	return ((Math.floor(365.25 * Year)) + (Math.floor(30.6001 * (Month + 1))) + Day + 1720994.5 + B);	
}

//TAKEN FROM: http://www.jgiesen.de/kepler/kepler.html
//CREDIT: Juergen Giesen
//Used to solve for E
function EccAnom(ec,m,dp) {
	// arguments:
	// ec=eccentricity, m=mean anomaly,
	// dp=number of decimal places

	var pi=Math.PI, K=pi/180.0;
	var maxIter=30, i=0;
	var delta=Math.pow(10,-dp);
	var E, F;

	m=m/360.0;
	m=2.0*pi*(m-Math.floor(m));

	if (ec<0.8) E=m; else E=pi;

	F = E - ec*Math.sin(m) - m;

	while ((Math.abs(F)>delta) && (i<maxIter)) {
		E = E - F/(1.0-ec*Math.cos(E));
		F = E - ec*Math.sin(E) - m;
		i = i + 1;
	}

	E=E/K;

	return Math.round(E*Math.pow(10,dp))/Math.pow(10,dp);
}

function toRadians(deg){
	return deg * (Math.PI / 180);
}

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

//draw circle
function drawCircle(x, y, radius, color, canvas)
{
    var c = document.getElementById(canvas);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

//set canvas full screen
function setCanvasSize()
{
    mainDiv = document.getElementById("canvasContainer")
    backgroundCanvas = document.getElementById("background");
    foregroundCanvas = document.getElementById("foreground");

    mainDiv.setAttribute("style", "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:0px;height:0px");
    mainDiv.style.width = window.innerWidth + "px"; //document.width is obsolete
    mainDiv.style.height = window.innerHeight + "px"; //document.width is obsolete

    backgroundCanvas.width = window.innerWidth; //document.width is obsolete
    backgroundCanvas.height = window.innerHeight; //document.height is obsolete

    foregroundCanvas.width = window.innerWidth; //document.width is obsolete
    foregroundCanvas.height = window.innerHeight; //document.height is obsolete
}



