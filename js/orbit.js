// document.addEventListener("click", mouseClick);

// function mouseClick(event)
// {
//     drawCircle(event.clientX, event.clientY);
// }

//onload and onresize
function init()
{
    setCanvasSize();
    renderBackground();
    renderForeground(new Date());
    // run();
}

function run()
{
    requestAnimationFrame(renderForeground);

    //loop
    setTimeout(run, 0);
}

//draw planets, ui elements
function renderForeground(date)
{
    var foreground = document.getElementById("foreground").getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var planetScale = 50;
    
    //clear the foreground
    foreground.clearRect(0, 0, width, height);

    //get julian date
    var today = date;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    console.log(dd + " " + mm + " " + yyyy);
    var julianDate = getJulianDate(yyyy, mm, dd);
    console.log(julianDate);
    //get julian centuries since epoch 
    var julianCenturies = (julianDate - 2451545.0) / 36525  //36535 is a julian century in julian days, 2451545 is julian epoch (Jan 2000)
    console.log(julianCenturies);

    //consts to get approx positon of mars
    //ELEMENTS @ J2000: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
	//RATES: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
	var MarsElements = [1.52371034,0.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891];
    var MarsRates = [0.00001847,0.00007882,-0.00813131,19140.30268499,0.44441088,-0.29257343];


    //rendermars on given date
    var marsCoords = getPlanetCoords(julianCenturies, MarsElements, MarsRates);
    //draw mars
    drawCircle((width / 2) + (marsCoords[0] * planetScale), (height / 2) - (marsCoords[1] * planetScale), 4, "red", "foreground");
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



