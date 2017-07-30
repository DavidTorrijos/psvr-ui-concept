# Import VRComponent module
{VRComponent, VRLayer} = require "VRComponent"


# VR Component
vr = new VRComponent
	front: "images/front.jpg"
	right: "images/right.jpg"
	left: "images/left.jpg"
	back: "images/back.jpg"
	bottom: "images/bottom.jpg"
	top: "images/top.jpg"
	arrowKeys = true


# Cursor
cursor = new Layer
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


# --- Layers ---
# Home layers 
header = new Layer
	width: 1024
	height: 46
	image: "images/Header.png"
header.heading = 0
header.elevation = 15
vr.projectLayer(header)

# Chat layers
chatHeader = new Layer
	width: 385
	height: 42
	image: "images/Chat_header.png"
chatHeader.heading = 40
chatHeader.elevation = 14
vr.projectLayer(chatHeader)

fernando = new Layer
	width: 385
	height: 70
	image: "images/Fernando.png"
fernando.heading = 40
fernando.elevation = 10
vr.projectLayer(fernando)

juan = new Layer
	width: 385
	height: 70
	image: "images/Juan.png"
juan.heading = 40
juan.elevation = 6.25
vr.projectLayer(juan)

oscar = new Layer
	width: 385
	height: 70
	image: "images/Oscar.png"
oscar.heading = 40
oscar.elevation = 2.5
vr.projectLayer(oscar)

carlos = new Layer
	width: 385
	height: 70
	image: "images/Carlos.png"
carlos.heading = 40
carlos.elevation = -1.25
vr.projectLayer(carlos)

deivid = new Layer
	width: 385
	height: 70
	image: "images/Deivid.png"
deivid.heading = 40
deivid.elevation = -5
vr.projectLayer(deivid)

pablo = new Layer
	width: 385
	height: 70
	image: "images/Pablo.png"
pablo.heading = 40
pablo.elevation = -8.75
vr.projectLayer(pablo)


# --- Interactives objects ---
# Define an objects array for each kind of layers
users = [fernando, juan, oscar, carlos, deivid, pablo]


# --- Orientation function --- 
# Animate each object on OrientationDidChange event
vr.on Events.OrientationDidChange, (data) ->

	# Store the camera X and Y positions in two variable
	# for use them any time
	heading = data.heading
	elevation = data.elevation
	
	# Chat users animations
	[].forEach.call users, (user) ->
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