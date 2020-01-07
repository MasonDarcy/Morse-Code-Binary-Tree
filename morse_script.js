
$(document).ready(function(){

//------Create two library object, drawing area for basic graphics.
var elem = document.getElementById('draw');
var params = {
height: $("#draw").clientHeight,
width:  $("#draw").clientWidth
}
var two = new Two(params).appendTo(elem);
var styles = {
size: 18,
family: 'Lato'
}
var circle_radius = 13;

//------NODE class that stores a letter and connections to parents and child nodes.
class NODE {
  constructor(name) {
    this.identifier = name;
    this.parent = null;
    this.left_child = null;
    this.right_child = null;
    this.xoffset = null;
    this.ycord = null;
    this.xcord = null;

    //------In root, manually set
    this.circle_representation = null;
    this.line_representation = null;
    this.name_representation = null;
    this.shape_collection = null;
  }
//------------------------Child adding methods
is_leaf() {
  if(this.left_child == null && this.right_child == null) {
    return true;
  } else {
    return false;
  }
}

create_child(name, side) {
var temp = new NODE(name);
//------Create links
temp.parent = this;

//------Set relative co-ordinates
temp.ycord = (this.ycord + 40) * 1.1;

  if(side == "left") {
      temp.xcord = this.xcord - this.xoffset;
      this.left_child = temp;
    } else {
      temp.xcord = this.xcord + this.xoffset;
      this.right_child = temp;
    }

//------Set xoffset for future children
temp.xoffset = this.xoffset / 1.96;

//------Add visual components
//var slope = (temp.ycord - this.ycord)/(temp.xcord - this.xcord);
var magnitude = Math.sqrt(Math.pow((this.xcord - temp.xcord),2) + Math.pow((this.ycord - temp.ycord),2));
var v1 = this.xcord - temp.xcord;
var v2 = this.ycord - temp.ycord;
var normv1 = v1 / magnitude;
var normv2 = v2 / magnitude;



temp.circle_representation = two.makeCircle(temp.xcord, temp.ycord, circle_radius);
temp.line_representation = two.makeLine(temp.xcord + normv1 * circle_radius, temp.ycord + normv2 * circle_radius, this.xcord - normv1 * circle_radius, this.ycord - normv2 * circle_radius);
temp.line_representation.opacity = 0.3;
temp.name_representation = two.makeText(temp.identifier, temp.xcord, temp.ycord+1, 'normal');

}
}

//------B_TREE class that represents a tree / acyclic graph.
class B_TREE {
  constructor (name)
  {

    this.root_node = new NODE(name);
    this.root_node.identifier = name;
    this.root_node.xcord = two.width / 2;
    this.root_node.ycord = two.height / 6;
    this.root_node.xoffset = 150;
    this.root_node.circle_representation = two.makeCircle(this.root_node.xcord, this.root_node.ycord, circle_radius);
    this.root_node.name_representation = two.makeText(this.root_node.identifier, this.root_node.xcord,this.root_node.ycord, 'normal');
    this.create_morse_code_tree();
  }

  color_tree(node) {
    if(node != this.root_node) {
      node.line_representation.opacity = 0.3;
    }

    if(node.left_child != null) {
      this.color_tree(node.left_child);
     this.color_tree(node.right_child);
    }

  }

  create_morse_code_tree() {
    //------Create tree, initialize attributes.
    //------height 1
    this.root_node.create_child("E", "left");
    this.root_node.create_child("T", "right");


    //------height 2
    this.root_node.left_child.create_child("I", "left");
    this.root_node.left_child.create_child("A", "right");
    this.root_node.right_child.create_child("N", "left");
    this.root_node.right_child.create_child("M", "right");

    //------height 3
    this.root_node.left_child.left_child.create_child("S", "left");
    this.root_node.left_child.left_child.create_child("U", "right");
    this.root_node.left_child.right_child.create_child("R", "left");
    this.root_node.left_child.right_child.create_child("W", "right");

    this.root_node.right_child.left_child.create_child("D", "left");
    this.root_node.right_child.left_child.create_child("K", "right");
    this.root_node.right_child.right_child.create_child("G", "left");
    this.root_node.right_child.right_child.create_child("O", "right");

    //------height 4
    this.root_node.left_child.left_child.left_child.create_child("H", "left");
    this.root_node.left_child.left_child.left_child.create_child("V", "right");
    this.root_node.left_child.left_child.right_child.create_child("F", "left");
    this.root_node.left_child.left_child.right_child.create_child("C", "right");
    this.root_node.left_child.right_child.left_child.create_child("L", "left");
      this.root_node.left_child.right_child.left_child.create_child("CH", "right");
    this.root_node.left_child.right_child.right_child.create_child("P", "left");
    this.root_node.left_child.right_child.right_child.create_child("J", "right");

    this.root_node.right_child.left_child.left_child.create_child("B", "left");
    this.root_node.right_child.left_child.left_child.create_child("X", "right");
    this.root_node.right_child.left_child.right_child.create_child("C", "left");
    this.root_node.right_child.left_child.right_child.create_child("Y", "right");
    this.root_node.right_child.right_child.left_child.create_child("Z", "left");
    this.root_node.right_child.right_child.left_child.create_child("Q", "right");


  }
}

//------NAVI class, object that traverses a B_TREE.
class NAVI {
constructor(home) {
  //-------B_TREE
  this.home = home;
  //------Root node of B_TREE
  this.current_location = home.root_node;
  //------Should have some graphical representation, perhaps a circle similar to node circles, traverses to the next node, maybe changes size or something sinusoidally
  this.circle_representation = two.makeCircle(this.current_location.xcord, this.current_location.ycord, circle_radius);
  this.circle_representation.opacity = 0.3;
  this.circle_representation.stroke = "limegreen";
  this.circle_representation.linewidth = 5;
  this.i = 0;
  this.direction = "left";
  this.speed = 1;
  this.initialize_graphic_binding();
}

update_current_node(direction) {
  if(direction == "left") {
        this.current_location = this.current_location.left_child;
  } else {
        this.current_location = this.current_location.right_child;
  }
this.current_location.line_representation.opacity = 1;
}

lock_in_selection() {
  $("#output").append(this.current_location.identifier);
  $("#output").append(" ");
  this.current_location = this.home.root_node;
  this.circle_representation.translation.set(this.current_location.xcord, this.current_location.ycord);
  this.home.color_tree(this.home.root_node);
  two.update();
}

key_down_actions(e) {
  var isleaf =  this.current_location.is_leaf();
  if(e.keyCode == 70 && keysPressed[0] != 70 && !isleaf) {
  clearTimeout(select);
  keysPressed.push(e.keyCode);
  $("audio")[0].currentTime = 0;
  $("audio")[0].play();
  start();
  console.log("Key pressed.");
  }
}

key_up_actions(e) {
  var isleaf =  this.current_location.is_leaf();
  if(!isleaf) {
  var elapsed_time = end();
  console.log(elapsed_time);
  if(e.keyCode == 70) {
  this.direction = get_direction(elapsed_time);
  two.play();
  $("#audio")[0].pause();
  keysPressed.pop();
  var context = this;
  select = setTimeout(function() {
    context.lock_in_selection();
  }, 500);
  }

  }

}


initialize_graphic_binding() {
var context = this;
  two.bind('update', function(frameCount) {
    if(context.current_location)
    var x1 = context.current_location.xcord;
    var x1 = context.current_location.xcord;
    var y1 = context.current_location.ycord;
    if(context.direction == "left") {
    var x2 = context.current_location.left_child.xcord;
    var y2 = context.current_location.left_child.ycord;
  } else {
    var x2 = context.current_location.right_child.xcord;
    var y2 = context.current_location.right_child.ycord;
  }

    var magnitude = Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2));
    var v1 = x2 - x1;
    var v2 = y2 - y1;
    var normv1 = v1 / magnitude;
    var normv2 = v2 / magnitude;
    var increment = magnitude / context.speed;
  context.circle_representation.translation.set(context.current_location.xcord + (normv1 * (increment * context.i)), context.current_location.ycord + (normv2 * increment * context.i));
  context.i = context.i + 1;
   if(context.i > context.speed) {
    two.pause();
    context.i = 0;
    context.update_current_node(context.direction);
  }
});
  }
}


//-----Global variables.
var select;
var tree = new B_TREE("!");
var navigator = new NAVI(tree);
var keysPressed = [];
var keyCodes = {
  70: "f"
}


//----------------------------------------------------
//------Event listeners.
$("#main_body").keydown(function(e) {
navigator.key_down_actions(e);
});

$("#main_body").keyup(function(e) {
navigator.key_up_actions(e);
});
//---------------------
$("#clear").click(function() {
$("#output").text("");
});
//---------------------
$("#delete_last").click(function() {

var str = $("#output").text();
$("#output").text(str.substr(0, str.length -2));
});
//---------------------------------------------------

two.update();
//------Some time keeping functions.-----------------
var startTime, endTime;
function get_direction(time) {
  if (time > 200) {
    return "right";
  } else {
    return "left";
  }

}
function start() {
startTime = new Date().getTime();
}
function end() {
  endTime = new Date().getTime();
  var timeDiff = endTime - startTime;
  return timeDiff;
}
//---------------------------------------------------

});
