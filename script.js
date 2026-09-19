/* =========================================================
   MIET SMART CAMPUS NAVIGATION SYSTEM
   REAL CAMPUS DATA - VERSION 2
   ========================================================= */


/* =========================================================
   MAP CENTER
   ========================================================= */

const MIET_CENTER = [28.9738, 77.6404];


/* =========================================================
   MAP INITIALIZATION
   ========================================================= */

const map = L.map("map", {

    zoomControl: false

}).setView(MIET_CENTER, 18);
/* =========================================================
PROFESSIONAL MAP CONTROLS
========================================================= */

const mapControls = L.control({
    position: "topright"
});


mapControls.onAdd = function () {

    const div = L.DomUtil.create(
        "div",
        "professional-map-controls"
    );

    div.innerHTML = `

        <button
            id="mapZoomIn"
            class="map-control-btn"
            title="Zoom in"
        >
            +
        </button>

        <button
            id="mapZoomOut"
            class="map-control-btn"
            title="Zoom out"
        >
            −
        </button>

        <div class="map-control-divider"></div>

        <button
            id="mapReset"
            class="map-control-btn map-control-icon"
            title="Show MIET Campus"
        >
            🧭
        </button>

        <button
            id="mapLocate"
            class="map-control-btn map-control-icon"
            title="Locate me"
        >
            📍
        </button>

    `;

    L.DomEvent.disableClickPropagation(div);

    return div;
};


mapControls.addTo(map);
/* =========================================================
   MAP CONTROL ACTIONS
========================================================= */


document.getElementById(
    "mapZoomIn"
).addEventListener(
    "click",
    function () {

        map.zoomIn();

    }
);


document.getElementById(
    "mapZoomOut"
).addEventListener(
    "click",
    function () {

        map.zoomOut();

    }
);


/* =========================================================
   RESET TO MIET CAMPUS
========================================================= */

document.getElementById(
    "mapReset"
).addEventListener(
    "click",
    function () {

        map.setView(
            MIET_CENTER,
            18,
            {
                animate: true
            }
        );

    }
);


/* =========================================================
   LOCATE USER
========================================================= */

document.getElementById(
    "mapLocate"
).addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            alert(
                "Location services are not supported by this browser."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                map.setView(
                    [lat, lng],
                    19,
                    {
                        animate: true
                    }
                );


                L.circleMarker(
                    [lat, lng],
                    {
                        radius: 7,
                        weight: 3,
                        fillOpacity: 1
                    }
                )
                    .addTo(map)
                    .bindTooltip(
                        "You are here",
                        {
                            direction: "top"
                        }
                    )
                    .openTooltip();

            },

            function () {

                alert(
                    "Unable to determine your location."
                );

            }

        );

    }
);

/* =========================================================
   STREET MAP
   ========================================================= */

const streetMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors"
    }
);


/* =========================================================
   SATELLITE MAP
   ========================================================= */

const satelliteMap = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 20,
        maxNativeZoom: 18,
        attribution: "Tiles &copy; Esri"
    }
);



/* Satellite as default */
satelliteMap.addTo(map);


/* =========================================================
   MAP LAYER SWITCHER
   ========================================================= */

const baseMaps = {
    "🛰️ Satellite": satelliteMap,
    "🗺️ Street Map": streetMap
};

L.control.layers(baseMaps).addTo(map);

/* =========================================================
   ROUTE COORDINATE CAPTURE TOOL
   ========================================================= */

let captureMode = false;
let currentPathType = "white";
let currentPath = [];
let capturedPaths = {
    white: [],
    red: [],
    black: []
};

let captureMarkers = [];
let captureLine = null;

/* =========================================================
   REAL MIET LOCATION DATABASE
   ========================================================= */

const locations = [

    /* =====================================================
       ACADEMIC / BUILDINGS
    ===================================================== */


    {
        id: "b5",
        name: "B5 / Visvesvaraya Block",
        category: "academic",
        latitude: 28.974486,
        longitude: 77.640038,

        entrance: {
            latitude: 28.974486,
            longitude: 77.640038
        },

        description:
            "Visvesvaraya Block / B5. Used by first-year B.Tech students of different branches."
    },

    {
        id: "b4",
        name: "B4 / Raman Block",
        category: "academic",
        latitude: 28.974026,
        longitude: 77.640467,
        description:
            "Raman Block / B4."
    },

    {
        id: "m-block",
        name: "M Block / Azim-Premji Block",
        category: "academic",
        latitude: 28.974479,
        longitude: 77.638970,
        description:
            "Azim-Premji Block. Mainly used by 2nd, 3rd and 4th year CSE students."
    },

    {
        id: "shroff",
        name: "Shroff / MCA Block",
        category: "academic",
        latitude: 28.973834,
        longitude: 77.640944,
        description:
            "Shroff Block, also known as MCA Block."
    },

    {
        id: "ccs",
        name: "CCS Block",
        category: "academic",
        latitude: 28.975105,
        longitude: 77.640461,

        entrance: {
            latitude: 28.975086,
            longitude: 77.640442
        },

        description:
            "Building associated with courses related to CCS University."
    },

    {
        id: "jrd",
        name: "JRD Tata Block",
        category: "academic",
        latitude: 28.975000,
        longitude: 77.640959,
        description:
            "JRD Tata building in the P Block area."
    },

    {
        id: "bhabha",
        name: "Bhabha Block",
        category: "academic",
        latitude: 28.974697,
        longitude: 77.640698,
        description:
            "Bhabha building in the P Block area."
    },

    {
        id: "pharmacy",
        name: "Pharmacy Block",
        category: "academic",
        latitude: 28.972692,
        longitude: 77.640316,
        description:
            "Pharmacy area associated with the Administrative Block."
    },


    /* =====================================================
       HOSTELS
    ===================================================== */

    {
        id: "boys-hostel-1",
        name: "Boys Hostel 1",
        category: "hostel",
        latitude: 28.973494,
        longitude: 77.639941,
        description:
            "Boys Hostel 1."
    },

    {
        id: "boys-hostel-2",
        name: "Boys Hostel 2",
        category: "hostel",
        latitude: 28.973986,
        longitude: 77.639534,
        description:
            "Boys Hostel 2."
    },

    {
        id: "faculty-hostel",
        name: "Faculty Hostel",
        category: "hostel",
        latitude: 28.972575,
        longitude: 77.639705,
        description:
            "Faculties accommodation area."
    },

    {
        id: "girls-hostel",
        name: "Girls Hostel",
        category: "hostel",
        latitude: 28.973025,
        longitude: 77.639346,
        description:
            "Girls Hostel."
    },


    /* =====================================================
       LIBRARIES
    ===================================================== */

    {
        id: "admin-library",
        name: "Administrative Block Library",
        category: "library",
        latitude: 28.972945,
        longitude: 77.640912,
        building: "Administrative Block",
        level: "Two floors",
        description:
            "Library located inside the Administrative Block."
    },

    {
        id: "raman-library",
        name: "Raman Block Library",
        category: "library",
        latitude: 28.974019,
        longitude: 77.640552,
        building: "B4 / Raman Block",
        level: "Underground",
        description:
            "Library located underground inside Raman Block."
    },

    {
        id: "azim-library",
        name: "Azim-Premji Block Library",
        category: "library",
        latitude: 28.974258,
        longitude: 77.639120,
        building: "M / Azim-Premji Block",
        level: "Underground",
        description:
            "Library located underground inside Azim-Premji Block."
    },


    /* =====================================================
       FACILITIES
    ===================================================== */
    {
        id: "admin",
        name: "Administrative Block",
        category: "facilities",
        latitude: 28.972945,
        longitude: 77.641228,
        description:
            "Main Administrative Block. Provides admission and essential administrative facilities for students, faculty and visitors."
    },
    {
        id: "canteen",
        name: "College Canteen",
        category: "food",
        latitude: 28.972898,
        longitude: 77.640011,
        description:
            "MIET College Canteen."
    },

    {
        id: "gym",
        name: "Gymnasium",
        category: "sports",
        latitude: 28.973536,
        longitude: 77.639866,

        entrance: {
            latitude: 28.973530,
            longitude: 77.639884
        },

        description:
            "MIET Gymnasium."
    },

    {
        id: "basketball",
        name: "Basketball Court",
        category: "sports",
        latitude: 28.972063,
        longitude: 77.640976,
        description:
            "Basketball court."
    },

    {
        id: "stationery",
        name: "Stationery Shop",
        category: "facilities",
        latitude: 28.972879,
        longitude: 77.640960,
        building: "Administrative Block",
        description:
            "Stationery shop located inside the Administrative Block Library area."
    },


    /* =====================================================
       GROUNDS
    ===================================================== */

    {
        id: "canteen-ground",
        name: "Canteen Ground",
        category: "ground",
        latitude: 28.973053,
        longitude: 77.640155,
        description:
            "Ground near the canteen area."
    },

    {
        id: "raman-ground",
        name: "Raman Block Ground",
        category: "ground",
        latitude: 28.973395,
        longitude: 77.640531,
        description:
            "Ground near Raman Block."
    },

    {
        id: "azim-ground",
        name: "Azim-Premji Ground",
        category: "ground",
        latitude: 28.974821,
        longitude: 77.639308,
        description:
            "Ground near Azim-Premji Block."
    },


    /* =====================================================
       PARKING
    ===================================================== */

    {
        id: "parking-1",
        name: "Parking Area 1",
        category: "parking",
        latitude: 28.972495,
        longitude: 77.641688,
        description:
            "Campus parking area."
    },

    {
        id: "parking-2",
        name: "Parking Area 2",
        category: "parking",
        latitude: 28.972049,
        longitude: 77.641447,
        description:
            "Campus parking area."
    },

    {
        id: "bus-parking",
        name: "College Bus Parking",
        category: "parking",
        latitude: 28.971960,
        longitude: 77.641238,
        description:
            "Parking area for college buses."
    },


    /* =====================================================
       GATES
    ===================================================== */

    {
        id: "main-gate",
        name: "Main Gate",
        category: "gate",
        latitude: 28.972303,
        longitude: 77.641528,
        description:
            "Primary entry gate of MIET."
    },

    {
        id: "girls-gate",
        name: "Girls Hostel Gate",
        category: "gate",
        latitude: 28.972668,
        longitude: 77.640070,
        description:
            "Gate near the Girls Hostel."
    },

    {
        id: "m-gate",
        name: "M Block Gate",
        category: "gate",
        latitude: 28.974437,
        longitude: 77.639517,
        description:
            "Gate separating the M Block / Azim-Premji area."
    },

    {
        id: "p-gate",
        name: "P Block Gate",
        category: "gate",
        latitude: 28.974667,
        longitude: 77.640332,
        description:
            "Gate separating the P Block area."
    },


    /* =====================================================
       OTHER IMPORTANT LOCATIONS
    ===================================================== */

    {
        id: "registrar",
        name: "Registrar Office",
        category: "facilities",
        latitude: 28.973276,
        longitude: 77.640872,
        building: "Administrative Block",
        description:
            "Registrar facility located in the Administrative Block."
    },

    {
        id: "mba",
        name: "MBA Facilities",
        category: "academic",
        latitude: 28.973092,
        longitude: 77.641131,
        building: "Administrative Block",
        description:
            "MBA facilities located in the Administrative Block."
    }

];


/* =========================================================
   MARKER STORAGE
   ========================================================= */
const markers = {};
const markerCluster =
    L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 45,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true
    });

map.addLayer(markerCluster);
/* =========================================================
   CAMPUS NAVIGATION
   ========================================================= */
const navigationLayer = L.layerGroup().addTo(map);

let currentRoute = null;
let startRouteMarker = null;
let destinationRouteMarker = null;
let navigationInfoControl = null;

// Remembers the starting point after the navigation popup is closed
let activeNavigationStartId = null;

/* =========================================================
   MIET WALKING PATH NETWORK
   ========================================================= */

const campusPaths = {
    "white": [
        [
            [28.974059, 77.640016],
            [28.974143, 77.640117],
            [28.974286, 77.640254],
            [28.97446, 77.640072]
        ],
        [
            [28.972082, 77.641466],
            [28.972286, 77.641565]
        ],
        [
            [28.972464, 77.641672],
            [28.972286, 77.641565]
        ],
        [
            [28.972287, 77.641507],
            [28.972384, 77.641345],
            [28.972462, 77.641214],
            [28.972487, 77.641091],
            [28.972527, 77.640961],
            [28.972642, 77.64083],
            [28.972752, 77.640721],
            [28.972782, 77.640668],
            [28.97282, 77.640627],
            [28.972973, 77.640434],
            [28.973013, 77.640471],
            [28.973065, 77.640414],
            [28.973162, 77.64031],
            [28.9733, 77.640151],
            [28.973331, 77.640141],
            [28.973433, 77.64024],
            [28.973559, 77.640367],
            [28.973665, 77.640478],
            [28.973777, 77.640326],
            [28.973864, 77.640214],
            [28.973944, 77.640108],
            [28.974059, 77.640016],
            [28.974148, 77.639906],
            [28.974234, 77.639791],
            [28.974352, 77.639635],
            [28.974504, 77.639444],
            [28.974598, 77.639312],
            [28.974663, 77.639239],
            [28.974567, 77.639071],
            [28.974497, 77.638985]
        ],
        [
            [28.972287, 77.641507],
            [28.972286, 77.641565]
        ],
        [
            [28.972462, 77.641214],
            [28.972536, 77.641202],
            [28.972604, 77.641279],
            [28.972883, 77.641245]
        ],
        [
            [28.972527, 77.640961],
            [28.972718, 77.640967],
            [28.972861, 77.640955],
            [28.97293, 77.640893]
        ],
        [
            [28.97282, 77.640627],
            [28.972967, 77.640793],
            [28.972923, 77.640896],
            [28.972861, 77.640955]
        ],
        [
            [28.972752, 77.640721],
            [28.972923, 77.640896],
            [28.972861, 77.640955]
        ],
        [
            [28.972782, 77.640668],
            [28.972694, 77.640533],
            [28.9726, 77.640425],
            [28.972667, 77.640338]
        ],
        [
            [28.972973, 77.640434],
            [28.972872, 77.640322],
            [28.972776, 77.640219],
            [28.972673, 77.640093],
            [28.972549, 77.639946],
            [28.972469, 77.639837],
            [28.972562, 77.639722]
        ],
        [
            [28.972562, 77.639722],
            [28.972815, 77.639445],
            [28.973002, 77.63936]
        ],
        [
            [28.973065, 77.640414],
            [28.972943, 77.640268],
            [28.97286, 77.640175],
            [28.972807, 77.64011],
            [28.972882, 77.640024]
        ],
        [
            [28.973162, 77.64031],
            [28.97307, 77.640174]
        ],
        [
            [28.973162, 77.64031],
            [28.973381, 77.640521]
        ],
        [
            [28.973331, 77.640141],
            [28.973479, 77.639955],
            [28.97353, 77.639884]
        ],
        [
            [28.973013, 77.640471],
            [28.973137, 77.64062],
            [28.973243, 77.640735],
            [28.973266, 77.640769],
            [28.97335, 77.640851],
            [28.97349, 77.640997],
            [28.973624, 77.641124],
            [28.973665, 77.641117],
            [28.973818, 77.640965]
        ],
        [
            [28.973624, 77.641124],
            [28.973757, 77.641272],
            [28.973888, 77.641129],
            [28.973979, 77.641015],
            [28.974049, 77.640929],
            [28.97411, 77.640858],
            [28.974245, 77.640693],
            [28.974339, 77.640599],
            [28.974466, 77.640435],
            [28.974531, 77.640341],
            [28.974585, 77.640266],
            [28.974651, 77.640319],
            [28.974761, 77.640398],
            [28.974851, 77.640487],
            [28.974918, 77.640546],
            [28.974872, 77.640644],
            [28.97481, 77.640732],
            [28.97476, 77.640803],
            [28.974748, 77.640842],
            [28.97481, 77.640916],
            [28.974877, 77.640971],
            [28.974942, 77.64103],
            [28.974986, 77.640972]
        ],
        [
            [28.974869, 77.640648],
            [28.974822, 77.640675],
            [28.974722, 77.640677]
        ],
        [
            [28.974761, 77.640398],
            [28.974851, 77.640323],
            [28.974967, 77.640319],
            [28.975086, 77.640442]
        ],
        [
            [28.974234, 77.639791],
            [28.974005, 77.639549]
        ],
        [
            [28.97424, 77.640694],
            [28.974066, 77.640508]
        ],
        [
            [28.973665, 77.640478],
            [28.973758, 77.640576],
            [28.973932, 77.640393],
            [28.973999, 77.640472],
            [28.974066, 77.640508]
        ],
        [
            [28.974663, 77.639239],
            [28.974804, 77.6393]
        ],
        [
            [28.972487, 77.641091],
            [28.972396, 77.640964],
            [28.972235, 77.641028],
            [28.972099, 77.640994]
        ],
        [
            [28.972487, 77.641091],
            [28.972467, 77.641028],
            [28.972307, 77.641171],
            [28.972221, 77.641307],
            [28.972002, 77.641221]
        ],
        [
            [28.974286, 77.640254],
            [28.974466, 77.640435]
        ],
        [
            [28.974059, 77.640016],
            [28.973808, 77.639783],
            [28.973513, 77.639442]
        ],
        [
            [28.974567, 77.639071],
            [28.974404, 77.639205],
            [28.974325, 77.639152],
            [28.974269, 77.639142]
        ]
    ],

    "red": [
        [
            [28.972604, 77.641279],
            [28.972679, 77.641381],
            [28.972691, 77.641542],
            [28.972787, 77.641571],
            [28.972862, 77.641585],
            [28.972947, 77.641625],
            [28.973083, 77.641526],
            [28.973193, 77.641411],
            [28.973345, 77.641223],
            [28.973456, 77.641113],
            [28.97349, 77.640997]
        ],
        [
            [28.973758, 77.640576],
            [28.973818, 77.64067],
            [28.97387, 77.640699],
            [28.973924, 77.640656],
            [28.973973, 77.640712],
            [28.974032, 77.640786],
            [28.974074, 77.640825],
            [28.97411, 77.640858]
        ],
        [
            [28.973818, 77.64067],
            [28.973719, 77.640787],
            [28.973638, 77.640892],
            [28.973566, 77.640971],
            [28.97349, 77.640997]
        ],
        [
            [28.9733, 77.640151],
            [28.973199, 77.640033],
            [28.973108, 77.639962],
            [28.973058, 77.6399],
            [28.973005, 77.639966],
            [28.972973, 77.640037],
            [28.972929, 77.640076],
            [28.972886, 77.640118],
            [28.972846, 77.640067],
            [28.972882, 77.640024]
        ],
        [
            [28.972985, 77.640807],
            [28.973086, 77.640905],
            [28.973185, 77.640842],
            [28.973266, 77.640769]
        ],
        [
            [28.973185, 77.640842],
            [28.973262, 77.640884]
        ]
    ],

    "black": [
        [
            [28.972686, 77.640079],
            [28.9726, 77.639983],
            [28.972551, 77.639953]
        ],
        [
            [28.974388, 77.639575],
            [28.974442, 77.639492]
        ],
        [
            [28.974622, 77.640283],
            [28.974686, 77.640326]
        ],
    ]
};
/* =========================================================
   DISPLAY RECORDED WALKING PATH NETWORK
   ========================================================= */

const recordedPathLayer =
    L.layerGroup();
function drawRecordedWalkingPaths() {

    recordedPathLayer.clearLayers();


    const drawPaths = function (
        paths,
        options
    ) {

        if (!Array.isArray(paths)) {
            return;
        }


        paths.forEach(path => {

            if (
                !Array.isArray(path) ||
                path.length < 2
            ) {
                return;
            }


            L.polyline(
                path,
                options
            ).addTo(
                recordedPathLayer
            );

        });

    };


    /* WHITE WALKING PATHS */

    drawPaths(
        campusPaths.white,
        {
            color: "#ffffff",
            weight: 4,
            opacity: 0.75,
            lineCap: "round",
            lineJoin: "round",
            interactive: false
        }
    );


    /* RED WALKING PATHS */

    drawPaths(
        campusPaths.red,
        {
            color: "#ef4444",
            weight: 5,
            opacity: 0.80,
            lineCap: "round",
            lineJoin: "round",
            interactive: false
        }
    );


    /* BLACK CROSSINGS */

    drawPaths(
        campusPaths.black,
        {
            color: "#111827",
            weight: 5,
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round",
            interactive: false
        }
    );

}


//drawRecordedWalkingPaths();
/* =========================================================
   ROUTING DISTANCE FUNCTION
   Self-contained Haversine distance in metres
   ========================================================= */

function routingDistance(point1, point2) {

    const lat1 =
        point1.lat !== undefined
            ? point1.lat
            : point1.latitude;

    const lng1 =
        point1.lng !== undefined
            ? point1.lng
            : point1.longitude;

    const lat2 =
        point2.lat !== undefined
            ? point2.lat
            : point2.latitude;

    const lng2 =
        point2.lng !== undefined
            ? point2.lng
            : point2.longitude;


    const R = 6371000;

    const toRadians =
        degrees =>
            degrees * Math.PI / 180;


    const dLat =
        toRadians(lat2 - lat1);

    const dLng =
        toRadians(lng2 - lng1);


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;
}
/* =========================================================
   SHORTEST PATH
   CLEAN RECORDED-PATH DIJKSTRA

   WHITE = normal walkable road
   RED   = normal walkable road
   BLACK = marked crossing

   IMPORTANT:
   - Only recorded consecutive points form roads.
   - Different recorded paths connect only at very
     close marked junctions.
   - No 8m/large-radius artificial shortcuts.
   - Black crossings are treated as traversable crossings.
   ========================================================= */
const roadClosures = {
    white: new Set(),
    red: new Set(),
    black: new Set()
};

window.setRoadClosure = function (type, pathIndex, closed = true) {
    if (!roadClosures[type]) return;

    if (closed) {
        roadClosures[type].add(Number(pathIndex));
        console.log(`🚧 CLOSED: ${type} path ${pathIndex}`);
    } else {
        roadClosures[type].delete(Number(pathIndex));
        console.log(`✅ OPEN: ${type} path ${pathIndex}`);
    }
};

window.clearAllRoadClosures = function () {
    roadClosures.white.clear();
    roadClosures.red.clear();
    roadClosures.black.clear();

    console.log("✅ ALL ROAD CLOSURES CLEARED");
};
function findShortestPath(startId, endId, options = {}) {

    console.log("🔥 NEW SHORTEST PATH ENGINE");

    const blockedPathKeys = new Set(
        options.blockedPathKeys || []
    );

    Object.keys(roadClosures).forEach(type => {
        roadClosures[type].forEach(pathIndex => {
            blockedPathKeys.add(
                `${type}:${pathIndex}`
            );
        });
    });

    const startLocation = locations.find(
        location => location.id === startId
    );

    const endLocation = locations.find(
        location => location.id === endId
    );

    if (!startLocation || !endLocation) {
        console.error("START OR END LOCATION NOT FOUND");
        return [];
    }


    /* =====================================================
       NORMALIZE PATH DATA
       ===================================================== */

    function normalizePaths(data) {

        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        // Single path:
        // [[lat,lng],[lat,lng],...]

        if (
            Array.isArray(data[0]) &&
            typeof data[0][0] === "number"
        ) {
            return [data];
        }

        // Multiple paths:
        // [
        //   [[lat,lng],[lat,lng]],
        //   [[lat,lng],[lat,lng]]
        // ]

        return data;
    }


    const whitePaths =
        normalizePaths(campusPaths.white);

    const redPaths =
        normalizePaths(campusPaths.red);

    const blackPaths =
        normalizePaths(campusPaths.black);


    console.log(
        "WHITE PATHS:",
        whitePaths.length
    );

    console.log(
        "RED PATHS:",
        redPaths.length
    );

    console.log(
        "BLACK CROSSINGS:",
        blackPaths.length
    );


    /* =====================================================
       GRAPH
       ===================================================== */

    const graph = {};
    const nodes = [];
    const segments = [];

    let nodeCounter = 0;

    function addNode(
        lat,
        lng,
        type,
        pathIndex
    ) {

        const node = {

            id: `node_${nodeCounter++}`,

            lat: lat,

            lng: lng,

            type: type,

            pathIndex: pathIndex

        };

        nodes.push(node);

        graph[node.id] = [];

        return node;
    }


    /* =====================================================
       ADD RECORDED PATH
       ===================================================== */

    function addPath(
        path,
        type,
        pathIndex
    ) {
        if (blockedPathKeys.has(`${type}:${pathIndex}`)) {
            console.log(
                "🚧 SKIPPING CLOSED PATH:",
                `${type} path ${pathIndex}`
            );
            return;
        }

        if (
            !Array.isArray(path) ||
            path.length < 2
        ) {
            return;
        }

        let previousNode = null;

        path.forEach(point => {

            const node = addNode(
                point[0],
                point[1],
                type,
                pathIndex
            );


            if (previousNode) {

                const d =
                    routingDistance(
                        previousNode,
                        node
                    );


                // ONLY consecutive recorded points
                graph[previousNode.id].push({

                    node: node,

                    weight: d

                });


                graph[node.id].push({

                    node: previousNode,

                    weight: d

                });
                segments.push({
                    a: previousNode,
                    b: node,
                    type: type,
                    pathIndex: pathIndex
                });

            }


            previousNode = node;

        });

    }


    /* =====================================================
       BUILD WHITE ROAD GRAPH
       ===================================================== */

    whitePaths.forEach(
        (path, index) => {

            addPath(
                path,
                "white",
                index
            );

        }
    );


    /* =====================================================
       BUILD RED ROAD GRAPH
       ===================================================== */

    redPaths.forEach(
        (path, index) => {

            addPath(
                path,
                "red",
                index
            );

        }
    );


    /* =====================================================
       BUILD BLACK CROSSING GRAPH
       ===================================================== */

    blackPaths.forEach(
        (path, index) => {

            addPath(
                path,
                "black",
                index
            );

        }
    );


    console.log(
        "TOTAL ROUTING NODES:",
        nodes.length
    );


    /* =========================================================
       EXPLICIT ROUTING JUNCTIONS
       =========================================================
    
       IMPORTANT:
       We do NOT automatically connect nearby roads.
    
       Roads connect only when:
       1. They are consecutive points in the same recorded path, OR
       2. We explicitly define a real junction below.
    
       This prevents fake blue lines across buildings/grounds.
       ========================================================= */

    function connectExplicitNodes(nodeA, nodeB, label) {

        if (!nodeA || !nodeB) {
            console.error(
                "❌ EXPLICIT JUNCTION FAILED:",
                label
            );
            return;
        }

        if (nodeA.id === nodeB.id) {
            return;
        }

        const distance =
            routingDistance(nodeA, nodeB);

        const alreadyAB =
            graph[nodeA.id].some(
                edge => edge.node.id === nodeB.id
            );

        if (!alreadyAB) {

            graph[nodeA.id].push({
                node: nodeB,
                weight: distance
            });

        }

        const alreadyBA =
            graph[nodeB.id].some(
                edge => edge.node.id === nodeA.id
            );

        if (!alreadyBA) {

            graph[nodeB.id].push({
                node: nodeA,
                weight: distance
            });

        }

        console.log(
            "🔗 EXPLICIT JUNCTION:",
            label,
            "|",
            nodeA.type,
            nodeA.lat,
            nodeA.lng,
            "<->",
            nodeB.type,
            nodeB.lat,
            nodeB.lng,
            "|",
            distance.toFixed(2),
            "m"
        );
    }


    /* ---------------------------------------------------------
       FIND A RECORDED NODE BY EXACT CAPTURED COORDINATE
       --------------------------------------------------------- */

    function findRecordedNode(
        type,
        latitude,
        longitude,
        maxDistance = 3
    ) {

        let closestNode = null;
        let closestDistance = Infinity;

        nodes.forEach(node => {

            if (node.type !== type) {
                return;
            }

            const distance =
                routingDistance(
                    node,
                    {
                        lat: latitude,
                        lng: longitude
                    }
                );

            if (
                distance < closestDistance
            ) {

                closestDistance = distance;
                closestNode = node;

            }

        });

        if (
            !closestNode ||
            closestDistance > maxDistance
        ) {

            console.error(
                "❌ RECORDED NODE NOT FOUND:",
                type,
                latitude,
                longitude,
                "closest:",
                closestDistance
            );

            return null;
        }

        return closestNode;
    }


    /* =========================================================
       REGISTRAR RED SHORTCUT
       =========================================================
    
       RED START:
       28.972969, 77.640803
    
       Existing WHITE junction:
       28.972967, 77.640793
    
    
       RED END:
       28.973249, 77.640751
    
       Existing WHITE junction:
       28.973243, 77.640735
       ========================================================= */

    /* =========================================================
       EXACT RECORDED COORDINATE JUNCTIONS
       =========================================================
    
       Only independently recorded paths that contain the
       SAME captured coordinate are connected.
    
       No distance-based guessing.
       No 1 metre / 5 metre / 8 metre shortcuts.
       ========================================================= */

    function connectExactRecordedCoordinate(
        latitude,
        longitude,
        label
    ) {

        const matchingNodes = nodes.filter(node => {

            if (
                node.type !== "white" &&
                node.type !== "red" &&
                node.type !== "black"
            ) {
                return false;
            }

            return (
                Math.abs(node.lat - latitude) < 0.0000001 &&
                Math.abs(node.lng - longitude) < 0.0000001
            );

        });


        if (matchingNodes.length < 2) {

            console.log(
                "ℹ️ EXACT JUNCTION NOT NEEDED:",
                label,
                "| matching nodes:",
                matchingNodes.length
            );

            return;
        }


        console.log(
            "🔗 EXACT RECORDED JUNCTION:",
            label,
            "| nodes:",
            matchingNodes.length
        );


        for (
            let i = 0;
            i < matchingNodes.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < matchingNodes.length;
                j++
            ) {

                const nodeA =
                    matchingNodes[i];

                const nodeB =
                    matchingNodes[j];


                const alreadyAB =
                    graph[nodeA.id].some(
                        edge =>
                            edge.node.id === nodeB.id
                    );


                if (!alreadyAB) {

                    graph[nodeA.id].push({
                        node: nodeB,
                        weight: 0
                    });

                }


                const alreadyBA =
                    graph[nodeB.id].some(
                        edge =>
                            edge.node.id === nodeA.id
                    );


                if (!alreadyBA) {

                    graph[nodeB.id].push({
                        node: nodeA,
                        weight: 0
                    });

                }


                console.log(
                    "   ↔",
                    nodeA.type,
                    "path",
                    nodeA.pathIndex,
                    "<->",
                    nodeB.type,
                    "path",
                    nodeB.pathIndex
                );

            }

        }

    }
    /* =========================================================
       CONNECT ALL EXACTLY MATCHING RECORDED JUNCTIONS
       =========================================================
    
       IMPORTANT:
       This does NOT connect nearby points.
    
       It connects ONLY points whose captured latitude AND
       longitude are exactly the same, and which belong to
       different recorded paths.
    
       Therefore:
       - no 1 metre guessing
       - no 5 metre guessing
       - no 10 metre guessing
       - no artificial shortcuts
    
       If you captured the same coordinate on two paths,
       that means those paths meet there.
       ========================================================= */

    const exactJunctionGroups = {};


    nodes.forEach(node => {

        if (
            node.type !== "white" &&
            node.type !== "red" &&
            node.type !== "black"
        ) {
            return;
        }


        const key =
            `${node.lat.toFixed(7)},${node.lng.toFixed(7)}`;


        if (!exactJunctionGroups[key]) {

            exactJunctionGroups[key] = [];

        }


        exactJunctionGroups[key].push(node);

    });


    Object.keys(exactJunctionGroups).forEach(key => {

        const group =
            exactJunctionGroups[key];


        if (group.length < 2) {
            return;
        }


        /*
         * Remove nodes from the SAME recorded path.
         * Consecutive points in the same path are already
         * connected by the normal path-building code.
         */

        const uniquePathNodes = [];


        group.forEach(node => {

            const alreadyRepresented =
                uniquePathNodes.some(
                    existing =>
                        existing.pathIndex === node.pathIndex &&
                        existing.type === node.type
                );


            if (!alreadyRepresented) {

                uniquePathNodes.push(node);

            }

        });


        if (uniquePathNodes.length < 2) {
            return;
        }


        console.log(
            "🔗 EXACT CAPTURED JUNCTION:",
            key,
            "|",
            uniquePathNodes.length,
            "PATHS"
        );


        for (
            let i = 0;
            i < uniquePathNodes.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < uniquePathNodes.length;
                j++
            ) {

                const nodeA =
                    uniquePathNodes[i];

                const nodeB =
                    uniquePathNodes[j];
                /* ---------------------------------------------------------
REGISTRAR DESTINATION:
Do NOT allow RED PATH 4 to enter directly into
the BLACK Registrar entrance.

When Registrar is the START, this connection remains
available so the existing Registrar → destination
route is preserved.
--------------------------------------------------------- */

                const isRegistrarRedBlackConnection =
                    (
                        nodeA.type === "red" &&
                        nodeA.pathIndex === 4 &&
                        nodeB.type === "black" &&
                        nodeB.pathIndex === 3 &&
                        Math.abs(nodeA.lat - 28.973257) < 0.0000001 &&
                        Math.abs(nodeA.lng - 77.640888) < 0.0000001
                    ) ||
                    (
                        nodeB.type === "red" &&
                        nodeB.pathIndex === 4 &&
                        nodeA.type === "black" &&
                        nodeA.pathIndex === 3 &&
                        Math.abs(nodeB.lat - 28.973257) < 0.0000001 &&
                        Math.abs(nodeB.lng - 77.640888) < 0.0000001
                    );

                if (
                    endLocation.id === "registrar" &&
                    isRegistrarRedBlackConnection
                ) {
                    console.log(
                        "🚫 REGISTRAR DESTINATION: RED → BLACK DIRECT ENTRY BLOCKED"
                    );

                    continue;
                }


                /*
                 * Do not connect two completely different
                 * colour systems merely because the coordinate
                 * happens to match unless it was actually
                 * recorded on both paths.
                 *
                 * Since BOTH nodes are present at the exact
                 * captured coordinate, this is a genuine
                 * recorded junction.
                 */


                const alreadyAB =
                    graph[nodeA.id].some(
                        edge =>
                            edge.node.id === nodeB.id
                    );


                if (!alreadyAB) {

                    graph[nodeA.id].push({
                        node: nodeB,
                        weight: 0
                    });

                }


                const alreadyBA =
                    graph[nodeB.id].some(
                        edge =>
                            edge.node.id === nodeA.id
                    );


                if (!alreadyBA) {
                    graph[nodeB.id].push({
                        node: nodeA,
                        weight: 0
                    });

                }


                console.log(
                    "   ↔",
                    nodeA.type,
                    "path",
                    nodeA.pathIndex,
                    "<->",
                    nodeB.type,
                    "path",
                    nodeB.pathIndex
                );

            }

        }

    });


    /* ---------------------------------------------------------
    WHITE PATH 18 ↔ WHITE PATH 17
    --------------------------------------------------------- */

    const whitePath18Node =
        findRecordedNode(
            "white",
            28.974869,
            77.640648,
            3
        );

    const whitePath17Node =
        findRecordedNode(
            "white",
            28.974872,
            77.640644,
            3
        );

    connectExplicitNodes(
        whitePath18Node,
        whitePath17Node,
        "WHITE PATH 18 ↔ WHITE PATH 17"
    );


    /* ---------------------------------------------------------
       RED START ↔ WHITE
       --------------------------------------------------------- */

    const registrarRedStart =
        findRecordedNode(
            "red",
            28.972969,
            77.640803
        );

    const registrarWhiteStart =
        findRecordedNode(
            "white",
            28.972967,
            77.640793
        );

    connectExplicitNodes(
        registrarRedStart,
        registrarWhiteStart,
        "RED SHORTCUT START ↔ WHITE"
    );
    /* ---------------------------------------------------------
       RED END ↔ WHITE
       --------------------------------------------------------- */

    const registrarBlackEnd =
        findRecordedNode(
            "black",
            28.973249,
            77.640751
        );

    const registrarWhiteEnd =
        findRecordedNode(
            "white",
            28.973243,
            77.640735
        );

    // DO NOT directly connect WHITE to BLACK here.
    // The Registrar approach must use the red entrance path.
    /* ---------------------------------------------------------
       REGISTRAR RED TURN ↔ UPPER/LEFT WHITE PATH
       --------------------------------------------------------- */

    /* ---------------------------------------------------------
       REGISTRAR RED TURN ↔ UPPER/LEFT WHITE PATH
       --------------------------------------------------------- */


    /* =========================================================
       DEBUG
       ========================================================= */

    console.log(
        "========== EXPLICIT JUNCTIONS READY =========="
    );

    console.log(
        "RED START:",
        registrarRedStart
    );

    console.log(
        "WHITE START:",
        registrarWhiteStart
    );

    console.log(
        "BLACK END:",
        registrarBlackEnd
    );

    console.log(
        "WHITE END:",
        registrarWhiteEnd
    );

    console.log(
        "=============================================="
    );
    /* =====================================================
       START / END CONNECTION
       =====================================================
    
       IMPORTANT:
       Buildings are NOT snapped to recorded vertices.
    
       Each building is connected to the nearest POINT ON
       a recorded WHITE/RED ROAD SEGMENT.
    
       This creates the short straight "entrance" line
       you want, then the route continues along the
       recorded road.
       ===================================================== */
    /* =========================================================
  CREATE VIRTUAL START / END NODES
  ========================================================= */

    const startNode = {
        id: "__START__",
        lat:
            startLocation.entrance?.latitude ??
            startLocation.latitude,
        lng:
            startLocation.entrance?.longitude ??
            startLocation.longitude,
        type: "location",

        // Optional building-specific routing entrance.
        routingEntrance:
            startLocation.routingEntrance || null
    };
    let startAttachment;

    if (
        startLocation.id === "registrar"
    ) {

        const registrarEntranceNode =
            findRecordedNode(
                "red",
                28.973257,
                77.640888,
                3
            );

        if (
            !registrarEntranceNode
        ) {

            console.error(
                "❌ REGISTRAR RED START ENTRANCE NOT FOUND"
            );

            return [];
        }

        startAttachment = {

            footNode:
                registrarEntranceNode,

            distance: 0

        };
        // Registrar START must leave through the red shortcut.
        if (startLocation.id === "registrar") {
            const registrarRedPrevious =
                findRecordedNode(
                    "red",
                    28.973169,
                    77.640843,
                    3
                );

            if (registrarRedPrevious) {
                graph[registrarEntranceNode.id] =
                    graph[registrarEntranceNode.id].filter(
                        edge =>
                            edge.node.type === "red"
                    );
            }
        }
        console.log(
            "🏢 REGISTRAR START LOCKED TO RED ENTRANCE:",
            registrarEntranceNode.lat,
            registrarEntranceNode.lng
        );

    } else {

        startAttachment =
            attachLocationToNetwork(
                startNode
            );

    }
    /* =========================================================
       ROUTING DESTINATION COORDINATE
       ========================================================= */

    let routeEndLatitude =
        endLocation.entrance?.latitude ??
        endLocation.latitude;

    let routeEndLongitude =
        endLocation.entrance?.longitude ??
        endLocation.longitude;

    if (
        endLocation.id === "registrar"
    ) {

        routeEndLatitude =
            28.973257;

        routeEndLongitude =
            77.640888;

        console.log(
            "🏢 REGISTRAR ROUTE TARGET:",
            routeEndLatitude,
            routeEndLongitude
        );

    }

    const endNode = {
        id: "__END__",
        lat: routeEndLatitude,
        lng: routeEndLongitude,
        type: "location"
    };

    graph["__START__"] = [];
    graph["__END__"] = [];
    /* -----------------------------------------------------
       Attach a building to the nearest recorded ROAD
       SEGMENT, not to the nearest recorded node.
       ----------------------------------------------------- */
    function attachLocationToNetwork(
        locationNode
    ) {

        /*
         * =========================================================
         * SAFE LOCATION → RECORDED ROAD ATTACHMENT
         * =========================================================
         *
         * IMPORTANT:
         *
         * NEVER create a new point in the middle of a road segment
         * for a building.
         *
         * A building must attach to an EXISTING RECORDED NODE.
         *
         * This prevents:
         *
         * Building
         *     ↓
         * arbitrary point on unrelated road
         *
         * and instead gives:
         *
         * Building
         *     ↓
         * recorded entrance/node
         *     ↓
         * recorded road
         *
         * =========================================================
         */

        const locationPoint = {
            lat: locationNode.lat,
            lng: locationNode.lng
        };

        /*
         * Existing recorded road nodes only.
         *
         * White and red are normal walkable roads.
         * Black crossings are handled separately.
         */
        const roadNodes =
            nodes.filter(
                node =>
                    node.type === "white" ||
                    node.type === "red"
            );

        if (
            roadNodes.length === 0
        ) {

            console.error(
                "❌ NO RECORDED ROAD NODES AVAILABLE"
            );

            return null;
        }


        /*
         * =========================================================
         * FIND CONNECTED ROAD COMPONENTS
         * =========================================================
         *
         * A building must not attach to an isolated recorded
         * branch when the main campus road network is available.
         *
         * We do NOT create any new junctions here.
         * We only determine which existing road nodes belong
         * to the largest connected road network.
         *
         * This prevents isolated paths such as WHITE PATH 18
         * from being selected simply because they are physically
         * close to a building.
         * =========================================================
         */

        const connectedRoadNodes =
            new Set();

        const roadNodeSet =
            new Set(roadNodes);

        const components = [];


        roadNodes.forEach(
            startNode => {

                if (
                    connectedRoadNodes.has(
                        startNode.id
                    )
                ) {
                    return;
                }


                const component =
                    [];

                const queue =
                    [startNode];

                connectedRoadNodes.add(
                    startNode.id
                );


                while (
                    queue.length > 0
                ) {

                    const current =
                        queue.shift();

                    component.push(
                        current
                    );


                    const edges =
                        graph[current.id] || [];


                    edges.forEach(
                        edge => {

                            const neighbour =
                                edge.node;


                            if (
                                !roadNodeSet.has(
                                    neighbour
                                )
                            ) {
                                return;
                            }


                            if (
                                connectedRoadNodes.has(
                                    neighbour.id
                                )
                            ) {
                                return;
                            }


                            connectedRoadNodes.add(
                                neighbour.id
                            );

                            queue.push(
                                neighbour
                            );

                        }
                    );

                }


                components.push(
                    component
                );

            }
        );


        /*
         * =========================================================
         * SELECT THE MAIN CONNECTED ROAD NETWORK
         * =========================================================
         */

        components.sort(
            (a, b) =>
                b.length - a.length
        );


        const mainRoadComponent =
            components[0] || [];


        console.log(
            "🛣️ MAIN ROAD COMPONENT:",
            mainRoadComponent.length,
            "nodes | TOTAL COMPONENTS:",
            components.length
        );


        /*
         * =========================================================
         * FIND NEAREST NODE ON MAIN NETWORK
         * =========================================================
         */

        let nearestNode = null;
        let nearestDistance = Infinity;


        mainRoadComponent.forEach(
            node => {

                const distance =
                    routingDistance(
                        locationPoint,
                        node
                    );


                if (
                    distance <
                    nearestDistance
                ) {

                    nearestDistance =
                        distance;

                    nearestNode =
                        node;

                }

            }
        );


        /*
         * =========================================================
         * SAFETY LIMIT
         * =========================================================
         *
         * If a location is too far from the recorded network,
         * DO NOT invent a road connection.
         *
         * 10 metres is intentionally conservative.
         */

        const MAX_ENTRANCE_DISTANCE = 10;


        if (
            !nearestNode ||
            nearestDistance >
            MAX_ENTRANCE_DISTANCE
        ) {

            console.error(
                "❌ NO SAFE RECORDED ENTRANCE:",
                locationNode.id,
                "| nearest:",
                nearestDistance.toFixed(2),
                "m"
            );

            return null;
        }


        /*
         * =========================================================
         * CONNECT LOCATION DIRECTLY TO EXISTING RECORDED NODE
         * =========================================================
         */

        if (
            !graph[locationNode.id]
        ) {

            graph[locationNode.id] = [];

        }


        graph[locationNode.id].push({
            node: nearestNode,
            weight: nearestDistance
        });


        /*
         * Reverse connection is required when this location
         * is used as a START point.
         */

        if (
            !graph[nearestNode.id].some(
                edge =>
                    edge.node.id ===
                    locationNode.id
            )
        ) {

            graph[nearestNode.id].push({
                node: locationNode,
                weight: nearestDistance
            });

        }


        console.log(
            "📍 SAFE LOCATION ATTACHMENT:",
            locationNode.id,
            "→",
            nearestNode.id,
            "| distance:",
            nearestDistance.toFixed(2),
            "m",
            "| road:",
            nearestNode.type,
            "| path:",
            nearestNode.pathIndex
        );


        return {

            /*
             * IMPORTANT:
             *
             * The route now starts/ends at a REAL recorded
             * road node, not an artificially-created point.
             */
            footNode:
                nearestNode,

            distance:
                nearestDistance

        };

    }

    let endAttachment;


    /* =========================================================
       REGISTRAR MUST ENTER THROUGH THE RED SHORTCUT
       ========================================================= */

    if (
        endLocation.id === "registrar"
    ) {

        const registrarEntranceNode =
            findRecordedNode(
                "red",
                28.973257,
                77.640888,
                3
            );

        if (
            !registrarEntranceNode
        ) {

            console.error(
                "❌ REGISTRAR RED ENTRANCE NODE NOT FOUND"
            );

            return [];
        }

        const registrarEntranceDistance = 0;

        endAttachment = {
            footNode:
                registrarEntranceNode,

            distance: 0
        };

        console.log(
            "🏢 REGISTRAR ENTRANCE:",
            registrarEntranceNode.lat,
            registrarEntranceNode.lng,
            "| DISTANCE:",
            registrarEntranceDistance.toFixed(2),
            "m"
        );

    } else if (
        endLocation.id === "ccs"
    ) {

        /*
         * CCS MUST USE ITS RECORDED WALKING ENTRANCE.
         *
         * This coordinate is an actual recorded white-path
         * point immediately at the CCS entrance.
         */
        const ccsEntranceNode =
            findRecordedNode(
                "white",
                28.975086,
                77.640442,
                3
            );

        if (
            !ccsEntranceNode
        ) {

            console.error(
                "❌ CCS RECORDED ENTRANCE NODE NOT FOUND"
            );

            return [];
        }

        endAttachment = {
            footNode:
                ccsEntranceNode,

            distance: 0
        };

        /*
         * IMPORTANT:
         * CCS route ends at the recorded entrance,
         * not at the building-center coordinate.
         */
        routeEndLatitude =
            ccsEntranceNode.lat;

        routeEndLongitude =
            ccsEntranceNode.lng;

        console.log(
            "🏢 CCS ENTRANCE LOCKED:",
            ccsEntranceNode.lat,
            ccsEntranceNode.lng
        );

    } else {

        const destinationNode = {
            id: "__DESTINATION__",
            lat:
                endLocation.entrance?.latitude ??
                endLocation.latitude,
            lng:
                endLocation.entrance?.longitude ??
                endLocation.longitude,
            type: "location",

            // Optional building-specific routing entrance.
            routingEntrance:
                endLocation.routingEntrance || null
        };
        endAttachment =
            attachLocationToNetwork(
                destinationNode
            );

    }

    if (
        !startAttachment ||
        !endAttachment
    ) {

        console.error(
            "❌ START/END COULD NOT BE ATTACHED TO ROAD"
        );

        return [];
    }


    /*
     * Keep these variables because your existing
     * diagnostic code below uses them.
     *
     * They now contain the virtual road-entry nodes,
     * NOT arbitrary nearby recorded vertices.
     */

    const startCandidates = [
        {
            node: startAttachment.footNode,
            distance: startAttachment.distance
        }
    ];

    const endCandidates = [
        {
            node: endAttachment.footNode,
            distance: endAttachment.distance
        }
    ];


    /* START → exact road entrance */

    graph["__START__"].push({
        node: startAttachment.footNode,
        weight: startAttachment.distance
    });


    /* =========================================================
    DESTINATION CONNECTION
 
    Registrar:
    The recorded red entrance node IS the destination.
    Do not create another artificial road → building edge.
    ========================================================= */

    /* =========================================================
       CONNECT ROAD → __END__
       ========================================================= */

    const endGraphNode = {
        id: "__END__",
        lat: routeEndLatitude,
        lng: routeEndLongitude,
        type: "destination",
        pathIndex: -1
    };


    /* ---------------------------------------------------------
       Registrar
       The red entrance itself is the destination.
       --------------------------------------------------------- */

    if (
        endLocation.id === "registrar"
    ) {

        graph[endAttachment.footNode.id].push({
            node: endGraphNode,
            weight: 0
        });

        console.log(
            "🏢 REGISTRAR DESTINATION LOCKED TO RED ENTRANCE:",
            endAttachment.footNode.lat,
            endAttachment.footNode.lng
        );

    } else {

        graph[
            endAttachment.footNode.id
        ].push({
            node: {
                id: "__END__",
                lat: routeEndLatitude,
                lng: routeEndLongitude,
                type: "destination",
                pathIndex: -1
            },
            weight: endAttachment.distance
        });

    }
    console.log("========== GRAPH EDGE COUNT ==========");

    let totalEdges = 0;

    Object.keys(graph).forEach(id => {

        totalEdges += graph[id].length;

    });

    console.log(
        "TOTAL NODES:",
        Object.keys(graph).length
    );

    console.log(
        "TOTAL EDGES:",
        totalEdges
    );

    console.log(
        "AVERAGE EDGES/NODE:",
        (
            totalEdges /
            Object.keys(graph).length
        ).toFixed(2)
    );

    console.log("======================================");
    /* =========================================================
       CONNECTIVITY DIAGNOSTIC
       ========================================================= */

    console.log("========== CONNECTIVITY DIAGNOSTIC ==========");

    function getReachableNodes(startId) {

        const visited = new Set();
        const queue = [startId];

        visited.add(startId);

        while (queue.length > 0) {

            const currentId = queue.shift();

            const edges =
                graph[currentId] || [];

            edges.forEach(edge => {

                const nextId =
                    edge.node.id;

                if (!visited.has(nextId)) {

                    visited.add(nextId);
                    queue.push(nextId);

                }

            });

        }

        return visited;
    }


    /* ---------------------------------------------------------
       Check every START candidate
       --------------------------------------------------------- */

    startCandidates.forEach((candidate, index) => {

        const startNode =
            candidate.node;

        const reachable =
            getReachableNodes(startNode.id);

        console.log(
            "START",
            index,
            startNode.id,
            "can reach",
            reachable.size,
            "nodes"
        );


        endCandidates.forEach((endCandidate, endIndex) => {

            const endNode =
                endCandidate.node;

            console.log(
                "   → END",
                endIndex,
                endNode.id,
                ":",
                reachable.has(endNode.id)
                    ? "✅ CONNECTED"
                    : "❌ NOT CONNECTED"
            );

        });

    });


    console.log("============================================");
    /* =========================================================
       START / END NODE DETAILS
       ========================================================= */

    console.log("========== START NODE DETAILS ==========");

    startCandidates.forEach((candidate, index) => {

        const n = candidate.node;

        console.log(
            "START",
            index,
            "| ID:",
            n.id,
            "| TYPE:",
            n.type,
            "| PATH:",
            n.pathIndex,
            "| LAT:",
            n.lat,
            "| LNG:",
            n.lng,
            "| EDGES:",
            (graph[n.id] || []).length
        );

    });


    console.log("========== END NODE DETAILS ==========");

    endCandidates.forEach((candidate, index) => {

        const n = candidate.node;

        console.log(
            "END",
            index,
            "| ID:",
            n.id,
            "| TYPE:",
            n.type,
            "| PATH:",
            n.pathIndex,
            "| LAT:",
            n.lat,
            "| LNG:",
            n.lng,
            "| EDGES:",
            (graph[n.id] || []).length
        );

    });


    console.log("=======================================");
    /* =========================================================
       FIND EXACT GAP BETWEEN DISCONNECTED GRAPH COMPONENTS
       ========================================================= */

    console.log("========== FINDING EXACT ROUTING GAP ==========");

    function getReachableFromNode(startId) {

        const visited = new Set();
        const queue = [startId];

        visited.add(startId);

        while (queue.length > 0) {

            const currentId = queue.shift();

            const edges = graph[currentId] || [];

            edges.forEach(edge => {

                const nextId = edge.node.id;

                if (!visited.has(nextId)) {

                    visited.add(nextId);
                    queue.push(nextId);

                }

            });

        }

        return visited;
    }
    /* =========================================================
       PATH 19 CONNECTION SEARCH
       ========================================================= */

    console.log("========== PATH 19 CONNECTION SEARCH ==========");

    const path19Nodes =
        nodes.filter(
            n => n.type === "white" && n.pathIndex === 19
        );

    const otherWhiteNodes =
        nodes.filter(
            n => n.type === "white" && n.pathIndex !== 19
        );

    path19Nodes.forEach(n19 => {

        let closest = null;

        otherWhiteNodes.forEach(other => {

            const d =
                routingDistance(n19, other);

            if (
                closest === null ||
                d < closest.distance
            ) {

                closest = {
                    distance: d,
                    node: other
                };

            }

        });

        console.log(
            "PATH 19 NODE:",
            n19.id,
            "|",
            n19.lat,
            n19.lng
        );

        console.log(
            "   CLOSEST OTHER PATH:",
            closest.node.id,
            "| PATH:",
            closest.node.pathIndex,
            "| DISTANCE:",
            closest.distance.toFixed(2),
            "m"
        );

        console.log(
            "   OTHER COORDINATES:",
            closest.node.lat,
            closest.node.lng
        );

    });

    console.log("==============================================");
    /* =====================================================
       DIJKSTRA
       ===================================================== */

    const distances = {};

    const previous = {};

    const visited = new Set();


    Object.keys(graph).forEach(
        id => {

            distances[id] =
                Infinity;

            previous[id] =
                null;

        }
    );


    distances["__START__"] = 0;


    while (true) {

        let current = null;

        let smallestDistance =
            Infinity;


        Object.keys(graph).forEach(
            id => {

                if (
                    visited.has(id)
                ) {
                    return;
                }


                if (
                    distances[id] <
                    smallestDistance
                ) {

                    smallestDistance =
                        distances[id];

                    current = id;

                }

            }
        );


        if (current === null) {
            break;
        }


        visited.add(current);


        if (
            current === "__END__"
        ) {
            break;
        }


        const edges =
            graph[current] || [];


        edges.forEach(
            edge => {

                const nextId =
                    edge.node.id;


                if (
                    visited.has(nextId)
                ) {
                    return;
                }


                const newDistance =
                    distances[current] +
                    edge.weight;


                if (
                    newDistance <
                    distances[nextId]
                ) {

                    distances[nextId] =
                        newDistance;


                    previous[nextId] =
                        current;

                }

            }
        );

    }


    /* =====================================================
       CHECK RESULT
       ===================================================== */

    if (
        distances["__END__"] ===
        Infinity
    ) {

        console.error(
            "❌ NO ROUTE FOUND"
        );

        return [];

    }


    console.log(
        "✅ ROUTE FOUND",
        distances["__END__"],
        "metres"
    );


    /* =====================================================
       RECONSTRUCT ROUTE
       ===================================================== */

    const path = [];

    let current =
        "__END__";


    while (
        current !== null
    ) {

        path.unshift(
            current
        );


        if (
            current ===
            "__START__"
        ) {

            break;

        }


        current =
            previous[current];

    }


    if (
        path.length === 0 ||
        path[0] !== "__START__"
    ) {

        console.error(
            "❌ ROUTE RECONSTRUCTION FAILED"
        );

        return [];

    }
    /* =====================================================
       CONVERT ROUTE NODE IDs → COORDINATES
       ===================================================== */

    const routeCoordinates =
        path.map(id => {

            /* -------------------------------------------------
               START
               ------------------------------------------------- */
            if (
                id === "__START__"
            ) {

                /*
                 * The graph starts at the virtual road-entry
                 * node. Use the actual road-entry coordinate
                 * instead of drawing a long straight line from
                 * the building centre to the road.
                 */

                if (
                    startLocation.id === "registrar"
                ) {

                    return [
                        28.973257,
                        77.640888
                    ];

                }


                /*
                 * Use the actual attachment point selected by
                 * attachLocationToNetwork().
                 */

                if (
                    startAttachment &&
                    startAttachment.footNode
                ) {

                    return [
                        startAttachment.footNode.lat,
                        startAttachment.footNode.lng
                    ];

                }


                return [
                    startLocation.latitude,
                    startLocation.longitude
                ];

            }


            /* -------------------------------------------------
               END
               ------------------------------------------------- */

            if (
                id === "__END__"
            ) {
                return [
                    routeEndLatitude,
                    routeEndLongitude
                ];
            }

            /* -------------------------------------------------
               NORMAL ROUTING NODE
               ------------------------------------------------- */

            const node =
                nodes.find(
                    item =>
                        item.id === id
                );


            if (
                !node
            ) {

                return null;

            }


            return [
                node.lat,
                node.lng
            ];

        })
            .filter(Boolean);


    /* =====================================================
       REMOVE ONLY EXACT DUPLICATES
       ===================================================== */

    const cleanedRoute = [];
    cleanedRoute.routePathKeys = Array.from(
        new Set(
            path
                .map(id =>
                    nodes.find(node => node.id === id)
                )
                .filter(node =>
                    node &&
                    (
                        node.type === "white" ||
                        node.type === "red" ||
                        node.type === "black"
                    )
                )
                .map(node =>
                    `${node.type}:${node.pathIndex}`
                )
        )
    );


    routeCoordinates.forEach(
        point => {

            if (
                cleanedRoute.length === 0
            ) {

                cleanedRoute.push(
                    point
                );

                return;

            }


            const previousPoint =
                cleanedRoute[
                cleanedRoute.length - 1
                ];


            if (
                Math.abs(
                    previousPoint[0] -
                    point[0]
                ) < 0.0000001 &&

                Math.abs(
                    previousPoint[1] -
                    point[1]
                ) < 0.0000001
            ) {

                return;

            }


            cleanedRoute.push(
                point
            );

        }
    );


    /* =====================================================
       DEBUG ROUTE
       ===================================================== */

    console.log(
        "========== FINAL ROUTE =========="
    );


    cleanedRoute.forEach(
        (point, index) => {

            console.log(
                index,
                point[0],
                point[1]
            );

        }
    );


    console.log(
        "================================="
    );


    return cleanedRoute;

}
window.selectAlternativeRoute = function (
    destinationId,
    routeIndex
) {
    const index = Number(routeIndex);

    console.log(
        "🔀 ALTERNATIVE CLICKED:",
        index + 1
    );

    if (
        !Number.isInteger(index) ||
        index < 0
    ) {
        console.error(
            "❌ INVALID ROUTE INDEX:",
            routeIndex
        );
        return;
    }

    if (!activeNavigationStartId) {
        console.error(
            "❌ No active navigation starting point saved"
        );
        return;
    }

    calculateRoute(
        destinationId,
        index
    );
};
function getRouteDistance(route) {

    let distance = 0;

    for (let i = 1; i < route.length; i++) {

        const pointA = route[i - 1];
        const pointB = route[i];

        if (
            Array.isArray(pointA) &&
            Array.isArray(pointB) &&
            pointA.length >= 2 &&
            pointB.length >= 2
        ) {

            const latLngA = L.latLng(
                pointA[0],
                pointA[1]
            );

            const latLngB = L.latLng(
                pointB[0],
                pointB[1]
            );

            distance +=
                latLngA.distanceTo(latLngB);
        }
    }

    return distance;
}
function getRouteSignature(route) {
    return route
        .map(point =>
            `${point[0].toFixed(6)},${point[1].toFixed(6)}`
        )
        .join("|");
}

function findAlternativeRoutes(
    startId,
    endId,
    primaryRoute,
    maxRoutes = 3
) {
    const routes = [primaryRoute];

    const signatures = new Set([
        getRouteSignature(primaryRoute)
    ]);

    const primaryPathKeys =
        primaryRoute.routePathKeys || [];

    primaryPathKeys.forEach(pathKey => {

        if (routes.length >= maxRoutes) return;

        const alternative = findShortestPath(
            startId,
            endId,
            {
                blockedPathKeys: [pathKey]
            }
        );

        if (!alternative || alternative.length < 2) {
            return;
        }

        const signature =
            getRouteSignature(alternative);

        if (signatures.has(signature)) {
            return;
        }

        signatures.add(signature);
        routes.push(alternative);
    });

    routes.sort(
        (a, b) =>
            getRouteDistance(a) -
            getRouteDistance(b)
    );

    return routes;
}
/* ---------------------------------------------------------
   DISTANCE BETWEEN TWO COORDINATES
   --------------------------------------------------------- */

function calculateDistance(point1, point2) {

    const R = 6371000;

    const lat1 = point1.latitude * Math.PI / 180;
    const lat2 = point2.latitude * Math.PI / 180;

    const dLat =
        (point2.latitude - point1.latitude)
        * Math.PI / 180;

    const dLon =
        (point2.longitude - point1.longitude)
        * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


/* ---------------------------------------------------------
   FIND NEAREST LOCATION
   --------------------------------------------------------- */

function findNearestLocation(latitude, longitude) {

    let nearest = null;
    let shortestDistance = Infinity;

    locations.forEach(location => {

        const distance =
            routingDistance(
                {
                    latitude,
                    longitude
                },
                location
            );

        if (distance < shortestDistance) {

            shortestDistance = distance;
            nearest = location;

        }

    });

    return nearest;
}


/* ---------------------------------------------------------
   CLEAR CURRENT ROUTE
   --------------------------------------------------------- */

function clearRoute() {

    navigationLayer.clearLayers();

    currentRoute = null;

}


/* =========================================================
   MARKER ICONS
   ========================================================= */

const categoryIcons = {

    academic: "🏫",
    library: "📚",
    hostel: "🛏️",
    food: "🍴",
    sports: "🏀",
    ground: "🌳",
    parking: "🅿️",
    gate: "🚪",
    facilities: "🏢"

};


/* =========================================================
   PROFESSIONAL MAP ICONS
========================================================= */

const categoryColors = {

    academic: "#2563eb",
    library: "#7c3aed",
    hostel: "#db2777",
    food: "#ea580c",
    sports: "#16a34a",
    ground: "#65a30d",
    parking: "#475569",
    gate: "#dc2626",
    facilities: "#0891b2"

};


function createLocationIcon(category) {

    const color =
        categoryColors[category] || "#2563eb";

    const icon =
        categoryIcons[category] || "📍";

    return L.divIcon({

        className: "professional-location-icon",

        html: `
            <div
                class="professional-marker"
                style="--marker-color:${color}"
                title="${category}"
            >
                <span>${icon}</span>
            </div>
        `,

        iconSize: [24, 24],

        iconAnchor: [12, 12],

        popupAnchor: [0, -14]

    });

}

/* =========================================================
   CREATE ALL MARKERS
   ========================================================= */

locations.forEach(location => {

    const icon =
        categoryIcons[location.category] || "📍";

    const marker =
        L.marker(
            [
                location.latitude,
                location.longitude
            ],
            {
                icon: createLocationIcon(
                    location.category
                )
            }
        )
            .addTo(markerCluster);

    marker.bindPopup(`

    <div class="location-popup">

        <div class="location-popup-icon">
            ${icon}
        </div>

        <div class="location-popup-title">
            ${location.name}
        </div>

        <div class="location-popup-description">
            ${location.description}
        </div>

        ${location.building
            ? `
                <div class="location-popup-detail">
                    <span>🏢</span>
                    <div>
                        <small>Building</small>
                        <strong>${location.building}</strong>
                    </div>
                </div>
            `
            : ""
        }

        ${location.level
            ? `
                <div class="location-popup-detail">
                    <span>📍</span>
                    <div>
                        <small>Level</small>
                        <strong>${location.level}</strong>
                    </div>
                </div>
            `
            : ""
        }

        <div class="location-popup-actions">

            <button
                class="popup-locate-btn"
                onclick="selectLocation('${location.id}')"
            >
                📍 Locate
            </button>

            <button
                class="popup-navigate-btn"
                onclick="startNavigation('${location.id}')"
            >
                🧭 Navigate
            </button>

        </div>

    </div>

`);


    markers[location.id] = marker;

});


/* =========================================================
   SEARCH ELEMENTS
   ========================================================= */

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const results =
    document.getElementById("results");


/* =========================================================
   SEARCH FUNCTION
   ========================================================= */

function searchLocations() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!query) {

        displayResults([]);

        return;

    }


    const matches =
        locations.filter(location => {

            return (

                location.name
                    .toLowerCase()
                    .includes(query)

                ||

                (location.building &&
                    location.building
                        .toLowerCase()
                        .includes(query))

                ||

                location.description
                    .toLowerCase()
                    .includes(query)

            );

        });


    displayResults(matches);

}


/* =========================================================
   DISPLAY SEARCH RESULTS
   ========================================================= */

function displayResults(matches) {

    if (matches.length === 0) {

        results.innerHTML = `

            <div class="welcome">

                <div class="welcome-icon">
                    🔎
                </div>

                <h3>
                    Search MIET
                </h3>

                <p>
                    Search for a building,
                    library, facility or hostel.
                </p>

            </div>

        `;

        return;

    }


    results.innerHTML = "";


    matches.forEach(location => {

        const card =
            document.createElement("div");


        card.className =
            "location-card";
        card.tabIndex = 0;

        const icon =
            categoryIcons[
            location.category
            ] || "📍";

        card.innerHTML = `

    <div class="location-card-main">

        <div class="location-card-icon">
            ${icon}
        </div>

        <div class="location-card-content">

            <h3>
                ${location.name}
            </h3>

            <p>
                ${location.description}
            </p>

        </div>

        <div class="location-card-arrow">
            →
        </div>

    </div>

    <span class="location-category">
        ${location.category}
    </span>

`;


        card.addEventListener(
            "click",
            () => selectLocation(location.id)
        );
        card.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    selectLocation(location.id);

                }

            }
        );


        results.appendChild(card);

    });

}


/* =========================================================
   SELECT LOCATION
   ========================================================= */
/* =========================================================
   SELECT LOCATION
   ========================================================= */

function selectLocation(id) {

    const location =
        locations.find(
            item => item.id === id
        );

    if (!location) return;

    const marker =
        markers[id];

    if (!marker) return;

    map.setView(
        [
            location.latitude,
            location.longitude
        ],
        19,
        {
            animate: true
        }
    );

    markerCluster.zoomToShowLayer(
        marker,
        function () {
            marker.openPopup();
        }
    );

}


/* =========================================================
   START NAVIGATION
========================================================= */

function startNavigation(id) {

    const destination =
        locations.find(
            item => item.id === id
        );

    if (!destination) return;


    const startOptions =
        locations
            .filter(
                location =>
                    location.id !== destination.id
            )
            .map(
                location =>
                    `<option value="${location.id}">
                        ${location.name}
                    </option>`
            )
            .join("");


    L.popup({
        maxWidth: 340
    })
        .setLatLng([
            destination.latitude,
            destination.longitude
        ])
        .setContent(`

        <div class="navigation-popup">

            <!-- HEADER -->

            <div class="navigation-popup-header">

                <div class="navigation-popup-icon">
                    🧭
                </div>

                <div>

                    <div class="navigation-popup-title">
                        Navigate
                    </div>

                    <div class="navigation-popup-subtitle">
                        Plan a walking route
                    </div>

                </div>

            </div>


            <!-- DESTINATION -->

            <div class="navigation-destination">

                <span class="navigation-destination-icon">
                    🏁
                </span>

                <div>

                    <small>
                        DESTINATION
                    </small>

                    <strong>
                        ${destination.name}
                    </strong>

                </div>

            </div>


            <!-- STARTING POINT -->

            <label
                class="navigation-label"
                for="navigationStart"
            >
                Starting point
            </label>


            <select
                id="navigationStart"
                class="navigation-select"
            >

                <option value="">
                    Select starting point
                </option>

                ${startOptions}

            </select>


            <!-- ACTION -->

            <button
                class="navigation-start-button"
                onclick="
                    calculateRoute(
                        '${destination.id}'
                    )
                "
            >
                🧭 Start Navigation
            </button>

        </div>

    `)
        .openOn(map);

}
/* =========================================================
   UI NOTIFICATION
========================================================= */

function showAppNotification(message, type = "warning") {

    const existing =
        document.querySelector(".app-notification");

    if (existing) {
        existing.remove();
    }

    const notification =
        document.createElement("div");

    notification.className =
        `app-notification ${type}`;


    let icon = "ℹ️";

    if (type === "error") {
        icon = "⚠️";
    }

    if (type === "loading") {
        icon = "🧭";
    }


    notification.innerHTML = `

        <div class="app-notification-icon">
            ${icon}
        </div>

        <div class="app-notification-content">
            ${message}
        </div>

        <button
            class="app-notification-close"
            onclick="this.parentElement.remove()"
            aria-label="Close"
        >
            ×
        </button>

    `;

    document.body.appendChild(notification);


    /* Loading notifications stay visible
       until another notification replaces them */

    if (type === "loading") {
        return;
    }


    setTimeout(() => {

        if (notification.parentElement) {

            notification.classList.add(
                "app-notification-hide"
            );

            setTimeout(() => {
                notification.remove();
            }, 200);

        }

    }, 3500);

}

/* =========================================================
   START NAVIGATION
========================================================= */
async function calculateRoute(
    destinationId,
    selectedRouteIndex = 0
) {
    const startSelect =
        document.getElementById("navigationStart");

    let startId;

    if (startSelect) {
        startId = startSelect.value;

        if (startId) {
            activeNavigationStartId = startId;
        }
    } else {
        startId = activeNavigationStartId;
    }

    if (!startId) {
        console.error(
            "❌ No active navigation starting point found"
        );
        return;
    }

    const startLocation =
        locations.find(
            location => location.id === startId
        );

    const destinationLocation =
        locations.find(
            location => location.id === destinationId
        );

    if (!startLocation || !destinationLocation) {
        console.error(
            "❌ START OR DESTINATION LOCATION NOT FOUND"
        );
        return;
    }
    // Close the navigation selection popup
    map.closePopup();

    showAppNotification(
        "Finding the best walking route...",
        "loading"
    );
    await new Promise(resolve => setTimeout(resolve, 800));
    // -----------------------------------------
    // FIND ROUTE
    // -----------------------------------------
    const primaryRoute =
        findShortestPath(
            startId,
            destinationId
        );

    const loadingNotification =
        document.querySelector(".app-notification.loading");

    if (loadingNotification) {
        loadingNotification.remove();
    }
    if (
        !primaryRoute ||
        primaryRoute.length < 2
    ) {

        showAppNotification(
            "No walking route is available between these locations yet.",
            "error"
        );

        return;
    }

    const routeOptions =
        findAlternativeRoutes(
            startId,
            destinationId,
            primaryRoute,
            3
        );

    let result =
        routeOptions[selectedRouteIndex] ||
        routeOptions[0];

    /*
     * SAFETY CHECK:
     * The route must always be rendered from
     * the selected START location to the destination.
     *
     * If an alternative route arrives reversed,
     * normalize its direction before drawing.
     */
    const expectedStart =
        locations.find(
            location => location.id === startId
        );

    const expectedDestination =
        locations.find(
            location => location.id === destinationId
        );

    if (
        result &&
        result.length >= 2 &&
        expectedStart &&
        expectedDestination
    ) {

        const firstPoint = result[0];
        const lastPoint =
            result[result.length - 1];

        const firstToStart =
            L.latLng(
                firstPoint[0],
                firstPoint[1]
            ).distanceTo(
                L.latLng(
                    expectedStart.entrance?.latitude ??
                    expectedStart.latitude,

                    expectedStart.entrance?.longitude ??
                    expectedStart.longitude
                )
            );

        const lastToStart =
            L.latLng(
                lastPoint[0],
                lastPoint[1]
            ).distanceTo(
                L.latLng(
                    expectedStart.entrance?.latitude ??
                    expectedStart.latitude,

                    expectedStart.entrance?.longitude ??
                    expectedStart.longitude
                )
            );

        /*
         * If the LAST point is closer to START than
         * the FIRST point, the route is backwards.
         */
        if (lastToStart < firstToStart) {

            result = [...result].reverse();

            /*
             * Preserve route metadata used by
             * alternative-route generation.
             */
            if (routeOptions[selectedRouteIndex]?.routePathKeys) {
                result.routePathKeys = [
                    ...routeOptions[
                        selectedRouteIndex
                    ].routePathKeys
                ].reverse();
            }

            console.warn(
                "↔️ ROUTE DIRECTION NORMALIZED"
            );
        }
    }

    console.log(
        "ROUTE OPTIONS FOUND:",
        routeOptions.length
    );

    console.log(
        "SELECTED ROUTE:",
        selectedRouteIndex + 1
    );
    // -----------------------------------------
    // REMOVE PREVIOUS ROUTE
    // -----------------------------------------

    if (currentRoute) {
        map.removeLayer(currentRoute);
        currentRoute = null;
    }

    // Remove previous information card
    if (navigationInfoControl) {
        map.removeControl(navigationInfoControl);
        navigationInfoControl = null;
    }

    // -----------------------------------------
    // ROUTE COORDINATES
    // -----------------------------------------

    const routeCoordinates = result;

    // --------------------------------------------------
    // CALCULATE ROUTE DISTANCE FROM COORDINATES
    // --------------------------------------------------

    let routeDistance = 0;

    for (let i = 1; i < routeCoordinates.length; i++) {

        const pointA = routeCoordinates[i - 1];
        const pointB = routeCoordinates[i];

        // routeCoordinates are [latitude, longitude]
        if (
            Array.isArray(pointA) &&
            Array.isArray(pointB) &&
            pointA.length >= 2 &&
            pointB.length >= 2
        ) {

            const latLngA = L.latLng(
                pointA[0],
                pointA[1]
            );

            const latLngB = L.latLng(
                pointB[0],
                pointB[1]
            );

            routeDistance +=
                latLngA.distanceTo(latLngB);
        }
    }

    // -----------------------------------------
    // WALKING TIME
    // -----------------------------------------

    const walkingSpeed = 80; // metres per minute

    const walkingTime = Math.max(
        1,
        Math.ceil(routeDistance / walkingSpeed)
    );





    // -----------------------------------------
    // DRAW BLUE ROUTE
    // USE THE ACTUAL RECORDED ROUTE
    // -----------------------------------------

    currentRoute = L.polyline(
        routeCoordinates,
        {
            color: "#2563eb",
            weight: 7,
            opacity: 0.92,

            lineCap: "round",
            lineJoin: "round",

            smoothFactor: 0
        }
    ).addTo(navigationLayer);
    /* =========================================================
       START & DESTINATION ROUTE MARKERS
    ========================================================= */


    /* Remove previous route endpoint markers */

    if (startRouteMarker) {
        navigationLayer.removeLayer(startRouteMarker);
        startRouteMarker = null;
    }

    if (destinationRouteMarker) {
        navigationLayer.removeLayer(destinationRouteMarker);
        destinationRouteMarker = null;
    }


    /* ---------------------------------------------------------
       START MARKER
    --------------------------------------------------------- */

    const startPoint =
        routeCoordinates[0];

    startRouteMarker = L.marker(
        startPoint,
        {
            icon: L.divIcon({
                className: "route-endpoint-icon",

                html: `
                <div class="route-start-marker">
                    <span>●</span>
                    <small>START</small>
                </div>
            `,

                iconSize: [70, 48],
                iconAnchor: [35, 24]
            }),

            zIndexOffset: 1000
        }
    ).addTo(navigationLayer);


    /* ---------------------------------------------------------
       DESTINATION MARKER
    --------------------------------------------------------- */

    const destinationPoint =
        routeCoordinates[
        routeCoordinates.length - 1
        ];

    destinationRouteMarker = L.marker(
        destinationPoint,
        {
            icon: L.divIcon({
                className: "route-endpoint-icon",

                html: `
                <div class="route-destination-marker">
                    <span>●</span>
                    <small>DESTINATION</small>
                </div>
            `,

                iconSize: [100, 48],
                iconAnchor: [50, 24]
            }),

            zIndexOffset: 1000
        }
    ).addTo(navigationLayer);
    /* =========================================================
       PROFESSIONAL ROUTE INFORMATION CARD
       DAY + NIGHT THEME
    ========================================================= */

    /* ---------------------------------------------------------
       ROUTE CARD STYLES
    --------------------------------------------------------- */

    if (!document.getElementById("miet-route-card-styles")) {

        const routeCardStyle =
            document.createElement("style");

        routeCardStyle.id =
            "miet-route-card-styles";

        routeCardStyle.textContent = `

        /* =================================================
           ROUTE CARD — LIGHT / DAY
        ================================================= */

        .route-info {
            margin: 0 !important;
            padding: 0 !important;
        }

        .route-card {
            width: 360px;
            max-width: calc(100vw - 32px);

            box-sizing: border-box;

            padding: 18px;

            border-radius: 20px;

            background:
                rgba(255, 255, 255, 0.96);

            color: #111827;

            border:
                1px solid rgba(15, 23, 42, 0.08);

            box-shadow:
                0 18px 45px rgba(15, 23, 42, 0.18),
                0 4px 12px rgba(15, 23, 42, 0.08);

            backdrop-filter:
                blur(16px);

            -webkit-backdrop-filter:
                blur(16px);

            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;

            overflow: hidden;

            animation:
                routeCardAppear 0.28s ease-out;
        }


        /* =================================================
           CARD ANIMATION
        ================================================= */

        @keyframes routeCardAppear {

            from {
                opacity: 0;
                transform:
                    translateY(10px)
                    scale(0.98);
            }

            to {
                opacity: 1;
                transform:
                    translateY(0)
                    scale(1);
            }

        }


        /* =================================================
           HEADER
        ================================================= */

        .route-card-header {
            display: flex;
            align-items: center;

            margin-bottom: 16px;
        }


        .route-card-title {
            display: flex;
            align-items: center;

            gap: 12px;

            width: 100%;
        }


        .route-icon {
            width: 44px;
            height: 44px;

            flex: 0 0 44px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 13px;

            background:
                linear-gradient(
                    135deg,
                    #2563eb,
                    #4f46e5
                );

            color: white;

            font-size: 21px;

            box-shadow:
                0 6px 16px
                rgba(37, 99, 235, 0.28);
        }


        .route-card-title > div:last-child {
            min-width: 0;
        }


        .route-card-title strong:first-child {
            display: block;

            font-size: 17px;
            line-height: 21px;

            font-weight: 750;

            letter-spacing: -0.2px;
        }


        .route-card-title span {
            display: block;

            margin-top: 3px;

            font-size: 11px;

            line-height: 15px;

            color: #6b7280;

            font-weight: 500;
        }


        .route-destination-name {
            display: block;

            margin-top: 1px;

            font-size: 13px;

            line-height: 18px;

            font-weight: 700;

            color: #2563eb;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;
        }


        /* =================================================
           JOURNEY
        ================================================= */

        .route-journey {
            display: flex;
            align-items: center;

            gap: 9px;

            min-height: 54px;

            padding: 11px 12px;

            margin-bottom: 14px;

            border-radius: 13px;

            background: #f8fafc;

            border:
                1px solid #e5e7eb;
        }


        .route-journey-point {
            flex: 1;

            min-width: 0;

            font-size: 12px;

            line-height: 16px;

            font-weight: 650;

            color: #374151;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;
        }


        .route-journey-point:first-child {
            text-align: left;
        }


        .route-journey-point:last-child {
            text-align: right;

            color: #111827;
        }


        .route-journey-arrow {
            flex: 0 0 auto;

            width: 28px;
            height: 28px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background: #eff6ff;

            color: #2563eb;

            font-size: 17px;

            font-weight: 700;
        }


        /* =================================================
           STATS
        ================================================= */

        .route-stats {
            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 10px;

            margin-bottom: 15px;
        }


        .route-stat {
            display: flex;
            align-items: center;

            gap: 10px;

            min-height: 64px;

            padding: 11px;

            box-sizing: border-box;

            border-radius: 14px;

            background: #ffffff;

            border:
                1px solid #e5e7eb;

            transition:
                transform 0.18s ease,
                box-shadow 0.18s ease,
                border-color 0.18s ease;
        }


        .route-stat:hover {
            transform: translateY(-1px);

            border-color:
                #dbeafe;

            box-shadow:
                0 6px 16px
                rgba(15, 23, 42, 0.08);
        }


        .route-stat-icon {
            width: 36px;
            height: 36px;

            flex: 0 0 36px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 10px;

            background: #f1f5f9;

            font-size: 17px;
        }


        .route-stat span {
            display: block;

            font-size: 10px;

            line-height: 14px;

            color: #6b7280;

            font-weight: 550;

            letter-spacing: 0.1px;
        }


        .route-stat strong {
            display: block;

            margin-top: 2px;

            font-size: 16px;

            line-height: 20px;

            font-weight: 750;

            color: #111827;
        }


        /* =================================================
           ROUTE OPTIONS
        ================================================= */
/* =================================================
   ALTERNATIVE ROUTES
================================================= */

.route-options {
    margin-top: 2px;

    padding-top: 14px;

    border-top:
        1px solid #e5e7eb;
}


.route-options-label {
    display: flex;
    align-items: center;

    gap: 8px;

    margin-bottom: 8px;

    font-size: 12px;

    line-height: 16px;

    font-weight: 700;

    color: #1f2937;

    letter-spacing: -0.05px;
}


.route-options-label-icon {
    width: 25px;
    height: 25px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 8px;

    background: #eff6ff;

    color: #2563eb;

    font-size: 13px;

    font-weight: 700;
}


.route-option-select {
    width: 100%;

    box-sizing: border-box;

    height: 46px;

    color-scheme: light;

    padding:
        0 38px 0 13px;

    border:
        1px solid #d1d5db;

    border-radius: 13px;

    background:
        linear-gradient(
            180deg,
            #ffffff 0%,
            #f9fafb 100%
        );

    color: #1f2937;

    font-family: inherit;

    font-size: 12px;

    font-weight: 600;

    cursor: pointer;

    outline: none;

    appearance: auto;

    transition:
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease,
        background 0.18s ease;
}


.route-option-select:hover {
    border-color: #93c5fd;

    background:
        linear-gradient(
            180deg,
            #ffffff 0%,
            #f5f9ff 100%
        );
}


.route-option-select:focus {
    border-color: #2563eb;

    box-shadow:
        0 0 0 3px
        rgba(37, 99, 235, 0.11);
}


.route-option-select:active {
    transform: scale(0.995);
}


/* =================================================
   DARK MODE — ALTERNATIVE ROUTES
================================================= */

body.dark-mode .route-options {
    border-top-color:
        rgba(148, 163, 184, 0.16);
}


body.dark-mode .route-options-label {
    color: #e2e8f0;
}


body.dark-mode .route-options-label-icon {
    background:
        rgba(37, 99, 235, 0.16);

    color: #60a5fa;
}


body.dark-mode .route-option-select {
    color-scheme: dark;

    background:
        linear-gradient(
            180deg,
            #1e293b 0%,
            #172033 100%
        );

    color: #f8fafc;

    border-color:
        #475569;
}
        body.dark-mode .route-option-select option {
    background: #1e293b;
    color: #f8fafc;
}

body:not(.dark-mode) .route-option-select option {
    background: #ffffff;
    color: #111827;
}


body.dark-mode .route-option-select:hover {
    border-color: #64748b;

    background:
        linear-gradient(
            180deg,
            #243247 0%,
            #1e293b 100%
        );
}


body.dark-mode .route-option-select:focus {
    border-color: #60a5fa;

    box-shadow:
        0 0 0 3px
        rgba(96, 165, 250, 0.13);
}


        /* =================================================
           STATUS
        ================================================= */

        .route-status {
            display: flex;
            align-items: center;

            gap: 8px;

            margin-top: 14px;

            padding-top: 12px;

            border-top:
                1px solid #e5e7eb;

            font-size: 11px;

            line-height: 15px;

            font-weight: 600;

            color: #16a34a;
        }


        .route-status-dot {
            width: 8px;
            height: 8px;

            flex: 0 0 8px;

            border-radius: 50%;

            background: #22c55e;

            box-shadow:
                0 0 0 4px
                rgba(34, 197, 94, 0.12);
        }


        /* =================================================
           LEAFLET CONTROL CLEANUP
        ================================================= */

        .leaflet-bottom.leaflet-left
        .route-info {
            margin-left: 10px !important;
            margin-bottom: 10px !important;
        }


        /* =================================================
           DARK / NIGHT MODE
        ================================================= */

        body.dark-mode .route-card {

            background:
                rgba(15, 23, 42, 0.96);

            color: #f8fafc;

            border:
                1px solid rgba(148, 163, 184, 0.16);

            box-shadow:
                0 20px 50px
                rgba(0, 0, 0, 0.42),
                0 5px 15px
                rgba(0, 0, 0, 0.25);
        }


        body.dark-mode .route-card-title span {
            color: #94a3b8;
        }


        body.dark-mode .route-destination-name {
            color: #60a5fa;
        }


        body.dark-mode .route-journey {
            background:
                rgba(30, 41, 59, 0.72);

            border-color:
                rgba(148, 163, 184, 0.16);
        }


        body.dark-mode .route-journey-point {
            color: #cbd5e1;
        }


        body.dark-mode .route-journey-point:last-child {
            color: #f8fafc;
        }


        body.dark-mode .route-journey-arrow {
            background:
                rgba(37, 99, 235, 0.18);

            color: #60a5fa;
        }


        body.dark-mode .route-stat {
            background:
                rgba(30, 41, 59, 0.75);

            border-color:
                rgba(148, 163, 184, 0.15);
        }


        body.dark-mode .route-stat:hover {
            border-color:
                rgba(96, 165, 250, 0.35);

            box-shadow:
                0 7px 18px
                rgba(0, 0, 0, 0.22);
        }


        body.dark-mode .route-stat-icon {
            background:
                rgba(51, 65, 85, 0.75);
        }


        body.dark-mode .route-stat span {
            color: #94a3b8;
        }


        body.dark-mode .route-stat strong {
            color: #f8fafc;
        }


        body.dark-mode .route-options {
            border-top-color:
                rgba(148, 163, 184, 0.16);
        }


        body.dark-mode .route-options-label {
            color: #cbd5e1;
        }


        body.dark-mode .route-option-select {
            background-color: #1e293b;

            color: #f8fafc;

            border-color:
                #475569;
        }


        body.dark-mode .route-option-select:hover {
            border-color: #64748b;
        }


        body.dark-mode .route-option-select:focus {
            border-color: #60a5fa;

            box-shadow:
                0 0 0 3px
                rgba(96, 165, 250, 0.14);
        }


        body.dark-mode .route-status {
            border-top-color:
                rgba(148, 163, 184, 0.16);

            color: #4ade80;
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 480px) {

            .route-card {
                width: 330px;

                max-width:
                    calc(100vw - 24px);

                padding: 15px;

                border-radius: 17px;
            }


            .route-icon {
                width: 40px;
                height: 40px;

                flex-basis: 40px;

                border-radius: 11px;

                font-size: 19px;
            }


            .route-card-title strong:first-child {
                font-size: 16px;
            }


            .route-stat {
                min-height: 60px;

                padding: 9px;
            }


            .route-stat-icon {
                width: 32px;
                height: 32px;

                flex-basis: 32px;
            }

        }

    `;

        document.head.appendChild(
            routeCardStyle
        );

    }


    /* ---------------------------------------------------------
       CREATE ROUTE INFORMATION CONTROL
    --------------------------------------------------------- */

    navigationInfoControl =
        L.control({
            position: "bottomleft"
        });


    navigationInfoControl.onAdd =
        function () {

            const div =
                L.DomUtil.create(
                    "div",
                    "route-info"
                );


            div.innerHTML = `

            <div class="route-card">

                <!-- =========================================
                     HEADER
                ========================================== -->

                <div class="route-card-header">

                    <div class="route-card-title">

                        <div class="route-icon">
                            🧭
                        </div>

                        <div>

                            <strong>
                                Route Found
                            </strong>

                            <span>
                                Navigating to
                            </span>

                            <strong
                                class="route-destination-name"
                            >
                                ${destinationLocation
                    ? destinationLocation.name
                    : "Destination"
                }
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- =========================================
                     JOURNEY
                ========================================== -->

                <div class="route-journey">

                    <span
                        class="route-journey-point"
                        title="${startLocation
                    ? startLocation.name
                    : "Starting point"
                }"
                    >
                        ${startLocation
                    ? startLocation.name
                    : "Starting point"
                }
                    </span>


                    <span class="route-journey-arrow">
                        →
                    </span>


                    <span
                        class="route-journey-point"
                        title="${destinationLocation
                    ? destinationLocation.name
                    : "Destination"
                }"
                    >
                        ${destinationLocation
                    ? destinationLocation.name
                    : "Destination"
                }
                    </span>

                </div>


                <!-- =========================================
                     ROUTE STATS
                ========================================== -->

                <div class="route-stats">


                    <!-- WALKING TIME -->

                    <div class="route-stat">

                        <div class="route-stat-icon">
                            🚶
                        </div>

                        <div>

                            <span>
                                Walking time
                            </span>

                            <strong>
                                ${walkingTime} min
                            </strong>

                        </div>

                    </div>


                    <!-- DISTANCE -->

                    <div class="route-stat">

                        <div class="route-stat-icon">
                            📏
                        </div>

                        <div>

                            <span>
                                Distance
                            </span>

                            <strong>
                                ${routeDistance < 1000
                    ? Math.round(routeDistance) + " m"
                    : (routeDistance / 1000).toFixed(2) + " km"
                }
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- =========================================
                     ROUTE OPTIONS
                ========================================== -->

                ${routeOptions.length > 1
                    ? `

                            <div class="route-options">
<div class="route-options-label">

    <span
        class="route-options-label-icon"
    >
        ↗
    </span>

    <span>
        Alternative routes
    </span>

</div>


                                <select
                                    class="route-option-select"
                                    onchange="
                                        window.selectAlternativeRoute(
                                            '${destinationId}',
                                            Number(this.value)
                                        )
                                    "
                                >

                                    ${routeOptions.map(
                        (route, index) => {

                            const distance =
                                getRouteDistance(
                                    route
                                );

                            const time =
                                Math.max(
                                    1,
                                    Math.ceil(
                                        distance / 80
                                    )
                                );

                            const distanceText =
                                distance < 1000
                                    ? `${Math.round(distance)} m`
                                    : `${(
                                        distance / 1000
                                    ).toFixed(2)} km`;

                            return `

                                                    <option
                                                        value="${index}"
                                                        ${index ===
                                    selectedRouteIndex
                                    ? "selected"
                                    : ""
                                }
                                                    >
                                                ${
    index === 0
        ? "● Recommended"
        : `↗ Alternative ${index}`
}
· ${distanceText} · ${time} min
                                                    </option>

                                                `;

                        }
                    ).join("")
                    }

                                </select>

                            </div>

                        `
                    : ""
                }


                <!-- =========================================
                     STATUS
                ========================================== -->

                <div class="route-status">

                    <span
                        class="route-status-dot"
                    ></span>

                    <span>
                        Route calculated successfully
                    </span>

                </div>


            </div>

        `;


            /* Prevent map clicks from passing through card */

            L.DomEvent.disableClickPropagation(
                div
            );

            L.DomEvent.disableScrollPropagation(
                div
            );


            return div;

        };


    navigationInfoControl.addTo(map);

    // -----------------------------------------
    // FIT MAP TO ROUTE
    // -----------------------------------------

    map.fitBounds(
        currentRoute.getBounds(),
        {
            padding: [50, 50]
        }
    );

}

/* =========================================================
   CATEGORY FILTER
   ========================================================= */

window.showCategory = function showCategory(category) {
    const matches =
        locations.filter(
            location =>
                location.category === category
        );


    displayResults(matches);

}


/* =========================================================
   SEARCH EVENTS
   ========================================================= */

searchBtn.addEventListener(
    "click",
    searchLocations
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchLocations();

        }

    }
);





/* =========================================================
   COPY COORDINATES
   ========================================================= */

function copyCoordinates(
    coordinates
) {

    navigator.clipboard.writeText(
        coordinates
    );


    alert(
        "Coordinates copied:\n" +
        coordinates
    );

}
/* =========================================================
   NIGHT MODE
========================================================= */

const themeToggle = document.getElementById("themeToggle");


// Load saved theme

const savedTheme = localStorage.getItem("miet-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "☀️";

}


// Toggle theme

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");


    if (isDark) {

        themeToggle.textContent = "☀️";

        localStorage.setItem(
            "miet-theme",
            "dark"
        );

    } else {

        themeToggle.textContent = "🌙";

        localStorage.setItem(
            "miet-theme",
            "light"
        );

    }

});
/* =========================================================
   FIX MIET CAMPUS STATUS DOT
========================================================= */

function fixMietCampusDot() {

    const elements =
        Array.from(
            document.querySelectorAll("*")
        );

    const campusText =
        elements.find(
            element =>
                element.children.length === 0 &&
                element.textContent.trim() === "MIET Campus"
        );

    if (!campusText) return;

    /*
       The text is normally inside the status pill.
    */

    const pill =
        campusText.parentElement;

    if (!pill) return;

    pill.classList.add(
        "miet-campus-pill-professional"
    );


    /*
       Look for the actual small circular
       status indicator.
    */

    const possibleDots =
        Array.from(
            pill.querySelectorAll("*")
        ).filter(element => {

            const rect =
                element.getBoundingClientRect();

            const style =
                window.getComputedStyle(
                    element
                );

            return (
                rect.width >= 5 &&
                rect.width <= 15 &&
                rect.height >= 5 &&
                rect.height <= 15 &&
                Math.abs(
                    rect.width -
                    rect.height
                ) <= 3 &&
                (
                    style.borderRadius === "50%" ||
                    style.borderRadius === "9999px"
                )
            );

        });


    if (possibleDots.length > 0) {

        possibleDots[0].classList.add(
            "miet-campus-dot-professional"
        );

    }

}


/* Run after page is ready */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        fixMietCampusDot
    );

} else {

    fixMietCampusDot();

}
/* =========================================================
   MIET CAMPUS — PROFESSIONAL STATUS DOT
========================================================= */

function fixMietCampusDot() {

    const campusText =
        Array.from(
            document.querySelectorAll("body *")
        ).find(el =>
            el.children.length === 0 &&
            el.textContent.trim() === "MIET Campus"
        );

    if (!campusText) return;

    const campusBox =
        campusText.getBoundingClientRect();

    /*
       Search nearby elements for the actual
       small circular status indicator.
    */

    const candidates =
        Array.from(
            document.querySelectorAll("body *")
        ).filter(el => {

            if (el === campusText) return false;

            const box =
                el.getBoundingClientRect();

            const width =
                box.width;

            const height =
                box.height;

            return (
                width >= 5 &&
                width <= 16 &&
                height >= 5 &&
                height <= 16 &&

                Math.abs(width - height) <= 3 &&

                box.right <=
                    campusBox.left + 4 &&

                box.right >=
                    campusBox.left - 35 &&

                Math.abs(
                    box.top - campusBox.top
                ) < 15
            );

        });


    /*
       Style the closest matching dot.
    */

    if (candidates.length) {

        const dot =
            candidates.sort(
                (a, b) => {

                    const aBox =
                        a.getBoundingClientRect();

                    const bBox =
                        b.getBoundingClientRect();

                    return (
                        Math.abs(
                            aBox.right -
                            campusBox.left
                        ) -
                        Math.abs(
                            bBox.right -
                            campusBox.left
                        )
                    );

                }
            )[0];


        dot.style.setProperty(
            "background-color",
            "#4ade80",
            "important"
        );

        dot.style.setProperty(
            "border-color",
            "#4ade80",
            "important"
        );

        dot.style.setProperty(
            "box-shadow",
            "0 0 0 3px rgba(74, 222, 128, 0.14), 0 0 8px rgba(74, 222, 128, 0.40)",
            "important"
        );

    }

}


/* Run after page loads */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            setTimeout(
                fixMietCampusDot,
                300
            );

        }
    );

} else {

    setTimeout(
        fixMietCampusDot,
        300
    );

}