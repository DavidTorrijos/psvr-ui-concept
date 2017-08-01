# Import VRComponent module
{VRComponent, VRLayer} = require "VRComponent"


# --- Stereoscopics glasses ---
leftGlass = new Layer
	width: 333
	height: 375
	x: 0
	y: 0
rightGlass = new Layer
	width: 333
	height: 375
	x: 333
	y: 0


# --- VR Components ---
vrLeft = new VRComponent
	front: "images/front.jpg"
	right: "images/right.jpg"
	left: "images/left.jpg"
	back: "images/back.jpg"
	bottom: "images/bottom.jpg"
	top: "images/top.jpg"
	width: 333
	height: 375
	parent: leftGlass
vrRight = new VRComponent
	front: "images/front.jpg"
	right: "images/right.jpg"
	left: "images/left.jpg"
	back: "images/back.jpg"
	bottom: "images/bottom.jpg"
	top: "images/top.jpg"
	width: 333
	height: 375
	parent: rightGlass


# --- Cursors ---
cursorLeft = new Layer
	width: 20
	height: 20
	x: Align.center
	y: Align.center
	backgroundColor: "rgba(0,211,255,0.75)"
	borderColor: "rgba(255,255,255,1)"
	borderWidth: 4
	borderRadius: 100
	shadowSpread: 2
	shadowColor: "rgba(255,255,255,0.66)"
	shadowBlur: 10
	parent: leftGlass
cursorRight = new Layer
	width: 20
	height: 20
	x: Align.center
	y: Align.center
	backgroundColor: "rgba(0,211,255,0.75)"
	borderColor: "rgba(255,255,255,1)"
	borderWidth: 4
	borderRadius: 100
	shadowSpread: 2
	shadowColor: "rgba(255,255,255,0.66)"
	shadowBlur: 10
	parent: rightGlass


# --- Layers ---
# Home layers 
headerLeft = new Layer
	width: 1024
	height: 46
	image: "images/Header.png"
headerLeft.heading = 0
headerLeft.elevation = 15
vrLeft.projectLayer(headerLeft)
headerRight = new Layer
	width: 1024
	height: 46
	image: "images/Header.png"
headerRight.heading = 0
headerRight.elevation = 15
vrRight.projectLayer(headerRight)

batmanLeft = new Layer
	width: 240
	height: 240
	image: "images/Batman.png"
batmanLeft.heading = -18
batmanLeft.elevation = 6
vrLeft.projectLayer(batmanLeft)
batmanRight = new Layer
	width: 240
	height: 240
	image: "images/Batman.png"
batmanRight.heading = -18
batmanRight.elevation = 6
vrRight.projectLayer(batmanRight)

gtSportLeft = new Layer
	width: 240
	height: 240
	image: "images/GTSport.png"
gtSportLeft.heading = -6
gtSportLeft.elevation = 6
vrLeft.projectLayer(gtSportLeft)
gtSportRight = new Layer
	width: 240
	height: 240
	image: "images/GTSport.png"
gtSportRight.heading = -6
gtSportRight.elevation = 6
vrRight.projectLayer(gtSportRight)

farpointLeft = new Layer
	width: 240
	height: 240
	image: "images/Farpoint.png"
farpointLeft.heading = 6
farpointLeft.elevation = 6
vrLeft.projectLayer(farpointLeft)
farpointRight = new Layer
	width: 240
	height: 240
	image: "images/Farpoint.png"
farpointRight.heading = 6
farpointRight.elevation = 6
vrRight.projectLayer(farpointRight)

vrWorldsLeft = new Layer
	width: 240
	height: 240
	image: "images/VRWorlds.png"
vrWorldsLeft.heading = 18
vrWorldsLeft.elevation = 6
vrLeft.projectLayer(vrWorldsLeft)
vrWorldsRight = new Layer
	width: 240
	height: 240
	image: "images/VRWorlds.png"
vrWorldsRight.heading = 18
vrWorldsRight.elevation = 6
vrRight.projectLayer(vrWorldsRight)

destinyLeft = new Layer
	width: 240
	height: 240
	image: "images/Destiny.png"
destinyLeft.heading = -18
destinyLeft.elevation = -6
vrLeft.projectLayer(destinyLeft)
destinyRight = new Layer
	width: 240
	height: 240
	image: "images/Destiny.png"
destinyRight.heading = -18
destinyRight.elevation = -6
vrRight.projectLayer(destinyRight)

fifaLeft = new Layer
	width: 240
	height: 240
	image: "images/Fifa18.png"
fifaLeft.heading = -6
fifaLeft.elevation = -6
vrLeft.projectLayer(fifaLeft)
fifaRight = new Layer
	width: 240
	height: 240
	image: "images/Fifa18.png"
fifaRight.heading = -6
fifaRight.elevation = -6
vrRight.projectLayer(fifaRight)

bloodborneLeft = new Layer
	width: 240
	height: 240
	image: "images/Bloodborne.png"
bloodborneLeft.heading = 6
bloodborneLeft.elevation = -6
vrLeft.projectLayer(bloodborneLeft)
bloodborneRight = new Layer
	width: 240
	height: 240
	image: "images/Bloodborne.png"
bloodborneRight.heading = 6
bloodborneRight.elevation = -6
vrRight.projectLayer(bloodborneRight)

moreLeft = new Layer
	width: 240
	height: 240
	image: "images/More.png"
moreLeft.heading = 18
moreLeft.elevation = -6
vrLeft.projectLayer(moreLeft)
moreRight = new Layer
	width: 240
	height: 240
	image: "images/More.png"
moreRight.heading = 18
moreRight.elevation = -6
vrRight.projectLayer(moreRight)

# --- Chat layers ---
chatHeaderLeft = new Layer
	width: 385
	height: 42
	image: "images/Chat_header.png"
chatHeaderLeft.heading = 40
chatHeaderLeft.elevation = 14
vrLeft.projectLayer(chatHeaderLeft)
chatHeaderRight = new Layer
	width: 385
	height: 42
	image: "images/Chat_header.png"
chatHeaderRight.heading = 40
chatHeaderRight.elevation = 14
vrRight.projectLayer(chatHeaderRight)

fernandoLeft = new Layer
	width: 385
	height: 70
	image: "images/Fernando.png"
fernandoLeft.heading = 40
fernandoLeft.elevation = 10
vrLeft.projectLayer(fernandoLeft)
fernandoRight = new Layer
	width: 385
	height: 70
	image: "images/Fernando.png"
fernandoRight.heading = 40
fernandoRight.elevation = 10
vrRight.projectLayer(fernandoRight)

juanLeft = new Layer
	width: 385
	height: 70
	image: "images/Juan.png"
juanLeft.heading = 40
juanLeft.elevation = 6.25
vrLeft.projectLayer(juanLeft)
juanRight = new Layer
	width: 385
	height: 70
	image: "images/Juan.png"
juanRight.heading = 40
juanRight.elevation = 6.25
vrRight.projectLayer(juanRight)

oscarLeft = new Layer
	width: 385
	height: 70
	image: "images/Oscar.png"
oscarLeft.heading = 40
oscarLeft.elevation = 2.5
vrLeft.projectLayer(oscarLeft)
oscarRight = new Layer
	width: 385
	height: 70
	image: "images/Oscar.png"
oscarRight.heading = 40
oscarRight.elevation = 2.5
vrRight.projectLayer(oscarRight)

carlosLeft = new Layer
	width: 385
	height: 70
	image: "images/Carlos.png"
carlosLeft.heading = 40
carlosLeft.elevation = -1.25
vrLeft.projectLayer(carlosLeft)
carlosRight = new Layer
	width: 385
	height: 70
	image: "images/Carlos.png"
carlosRight.heading = 40
carlosRight.elevation = -1.25
vrRight.projectLayer(carlosRight)

deividLeft = new Layer
	width: 385
	height: 70
	image: "images/Deivid.png"
deividLeft.heading = 40
deividLeft.elevation = -5
vrLeft.projectLayer(deividLeft)
deividRight = new Layer
	width: 385
	height: 70
	image: "images/Deivid.png"
deividRight.heading = 40
deividRight.elevation = -5
vrRight.projectLayer(deividRight)

pabloLeft = new Layer
	width: 385
	height: 70
	image: "images/Pablo.png"
pabloLeft.heading = 40
pabloLeft.elevation = -8.75
vrLeft.projectLayer(pabloLeft)
pabloRight = new Layer
	width: 385
	height: 70
	image: "images/Pablo.png"
pabloRight.heading = 40
pabloRight.elevation = -8.75
vrRight.projectLayer(pabloRight)

# --- Setting layers ---
settingsLeft = new Layer
	width: 385
	height: 496
	image: "images/Settings.png"
settingsLeft.heading = 65
settingsLeft.elevation = 3.5
vrLeft.projectLayer(settingsLeft)
settingsRight = new Layer
	width: 385
	height: 496
	image: "images/Settings.png"
settingsRight.heading = 65
settingsRight.elevation = 3.5
vrRight.projectLayer(settingsRight)

# --- News layers ---
newsLeft = new Layer
	width: 768
	height: 554
	image: "images/News.png"
newsLeft.heading = -48.5
newsLeft.elevation = 2.5
vrLeft.projectLayer(newsLeft)
newsRight = new Layer
	width: 768
	height: 554
	image: "images/News.png"
newsRight.heading = -48.5
newsRight.elevation = 2.5
vrRight.projectLayer(newsRight)


# --- Interactives objects ---
# Define an objects array for each kind of layers
gamesLeft = [batmanLeft, gtSportLeft, farpointLeft, vrWorldsLeft, destinyLeft, fifaLeft, bloodborneLeft, moreLeft]

gamesRight = [batmanRight, gtSportRight, farpointRight, vrWorldsRight, destinyRight, fifaRight, bloodborneRight, moreRight]

usersLeft = [fernandoLeft, juanLeft, oscarLeft, carlosLeft, deividLeft, pabloLeft]

usersRight = [fernandoRight, juanRight, oscarRight, carlosRight, deividRight, pabloRight]


# --- Orientation function --- 
# Animate each object on OrientationDidChange event
vrLeft.on Events.OrientationDidChange, (data) ->

	# Store the camera X and Y positions in two variable
	# for use them any time
	heading = data.heading
	elevation = data.elevation

	# Games animations
	[].forEach.call gamesLeft, (game) ->
		exeX = Math.abs(heading - game.heading)
		exeY = Math.abs(elevation - game.elevation)
		
		if exeX < 5.75 && exeY < 5.75
			game.animate
				scale: 1.05
				opacity: 1
				options:
					time: 0.50
					curve: Spring
		else
			game.animate
				scale: 1
				opacity: 0.7
				options:
					time: 0.50
					curve: Spring
	
	# Chat users animations
	[].forEach.call usersLeft, (user) ->
		exeX = Math.abs(heading - user.heading)
		exeY = Math.abs(elevation - user.elevation)
		
		if exeX < 9 && exeY < 1.5
			user.animate
				scale: 1.1
				options:
					time: 0.50
					curve: Spring
		else
			user.animate
				scale: 1
				options:
					time: 0.50
					curve: Spring

vrRight.on Events.OrientationDidChange, (data) ->

	# Store the camera X and Y positions in two variable
	# for use them any time
	heading = data.heading
	elevation = data.elevation

	# Games animations
	[].forEach.call gamesRight, (game) ->
		exeX = Math.abs(heading - game.heading)
		exeY = Math.abs(elevation - game.elevation)
		
		if exeX < 5.75 && exeY < 5.75
			game.animate
				scale: 1.05
				opacity: 1
				options:
					time: 0.50
					curve: Spring
		else
			game.animate
				scale: 1
				opacity: 0.7
				options:
					time: 0.50
					curve: Spring
	
	# Chat users animations
	[].forEach.call usersRight, (user) ->
		exeX = Math.abs(heading - user.heading)
		exeY = Math.abs(elevation - user.elevation)
		
		if exeX < 9 && exeY < 1.5
			user.animate
				scale: 1.1
				options:
					time: 0.50
					curve: Spring
		else
			user.animate
				scale: 1
				options:
					time: 0.50
					curve: Spring