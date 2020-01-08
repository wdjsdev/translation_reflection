/*if ("[ O ]"
	layer exists)
{
	app.activeDocument.layers.getByName('[ O ]').pageItems.getByName('_ Delete _').remove();
	Disable "Transform" - FXs to[O] Layer.(or Reduce to Basic Appearance).
	var A1 = Select All elements inside[O] Layer.
	var G1 = Duplicate the selected elements(A1) symmetrically to the right side and group them.
	var G2 = Duplicate G1 group symmetrically to the Downside.
	var G3 = Duplicate G2 group symmetrically to the left side.
	var G4 = Group all(G1 + G2 + G3) groups together.
	rename G4 Group to "[ O ]"
}*/

#target Illustrator
function doSomething()
{
	var valid = true;

	//
	//logic container

	function requiredLayerMissing(name)
	{
		alert("The required layer: " + name + ", is missing.");
	}

	function getCenterPoint()
	{
		var result = [];
		guidesLayer.locked = false;
		guidesLayer.visible = true;
		docRef.selection = null;
		guidesLayer.hasSelectedArtwork = true;
		app.executeMenuCommand("group");
		var curGroup = docRef.selection[0];
		result[0] = curGroup.left + curGroup.width/2;
		result[1] = curGroup.top - curGroup.height/2;
		app.executeMenuCommand("ungroup");
		docRef.selection = null;
		guidesLayer.locked = true;
		return result;
	}

	function translateArtwork(group,dir)
	{
		var newGroup = group.duplicate();
		app.redraw();
		try
		{
			docRef.selection = null;
		}
		catch(e){}

		newGroup.selected = true;
		if(dir === "down")
		{
			var offset = centerPoint[1] - (group.top - group.height);
			newGroup.top = centerPoint[1] - offset;
			runAction(actionData.reflect_vert);
		}
		else if(dir === "right")
		{
			var offset = (group.left + group.width) - centerPoint[0];
			newGroup.left = centerPoint[0] + offset;
			runAction(actionData.reflect_horz);
		}
 
	}

	function removeEffects(layer)
	{
		//since the effects seem to be applied to the layer
		//instead of the group of artwork, let's just copy all
		//the artwork to a new layer with the same name
		//so that we can remove the layer effects without affecting
		//the appearance of the artwork itself.
		//return the new layer so it can be saved back into whatever
		//variable

		var newLayer = layer.parent.layers.add();
		newLayer.name = layer.name;
		var item, itemDup,newGroup;
		for(var i = layer.pageItems.length - 1; i>=0; i--)
		{
			item = layer.pageItems[i];
			if(item.locked)
			{
				continue;
			}

			if(!newGroup)
			{
				newGroup = newLayer.groupItems.add();
			}
			
			itemDup = item.duplicate(newGroup);
		}
		layer.remove();
		newLayer.zOrder(ZOrderMethod.SENDTOBACK);
		newLayer.hasSelectedArtwork = true;
		return newLayer;
	}

	function runAction(obj)
	{
		createAction(obj.name,obj.actionString);
		app.doScript(obj.name,obj.name);
		removeAction(obj.name);
	}

	//find a specific layer inside a given parent
	//or return undefined;
	function findSpecificLayer(parent,layerName)
	{
		var result,layers;

		if(parent.typename === "Layer" || parent.typename === "Document")
		{
			layers = parent.layers;	
		}
		else if(parent.typename === "Layers")
		{
			layers = parent;
		}
		
		for(var x=0,len=layers.length;x<len && !result;x++)
		{
			if(layers[x].name.toLowerCase() === layerName.toLowerCase())
			{
				result = layers[x];
			}
		}
		return result;
	}

	//create and load a new action
	function createAction(name,actionString)
	{
		var dest = new Folder("~/Documents");
		var actionFile = new File(dest + "/" + name + ".aia" );

		actionFile.open("w");
		actionFile.write(actionString.join("\n"));
		actionFile.close();
		
		//load the action
		app.loadAction(actionFile);
	}


	//remove all instances of an action with a given name
	function removeAction(actionName)
	{
		var localValid = true;

		while(localValid)
		{
			try
			{
				app.unloadAction(actionName,"");
			}
			catch(e)
			{
				localValid = false;
			}
		}
	}


	//logic container
	//




	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var aB = docRef.artboards;
	var swatches = docRef.swatches;

	var hudLayerName = "HUD";
	var guidesLayerName = "Guides";
	var hudLayer,targetLayer,guidesLayer;

	var myItem,newItem;


	var actionData = 
	{
		"reflect_vert":
		{
			name:"reflect_vert",
			actionString:
			[
				"/version 3",
				"/name [ 12",
				"	7265666c6563745f76657274",
				"]",
				"/isOpen 0",
				"/actionCount 1",
				"/action-1 {",
				"	/name [ 12",
				"		7265666c6563745f76657274",
				"	]",
				"	/keyIndex 0",
				"	/colorIndex 0",
				"	/isOpen 1",
				"	/eventCount 1",
				"	/event-1 {",
				"		/useRulersIn1stQuadrant 0",
				"		/internalName (adobe_reflect)",
				"		/localizedName [ 7",
				"			5265666c656374",
				"		]",
				"		/isOpen 1",
				"		/isOn 1",
				"		/hasDialog 1",
				"		/showDialog 0",
				"		/parameterCount 2",
				"		/parameter-1 {",
				"			/key 1634625388",
				"			/showInPalette 4294967295",
				"			/type (unit real)",
				"			/value 0.0",
				"			/unit 591490663",
				"		}",
				"		/parameter-2 {",
				"			/key 1668247673",
				"			/showInPalette 4294967295",
				"			/type (boolean)",
				"			/value 0",
				"		}",
				"	}",
				"}"
			]
		},
		"reflect_horz":
		{
			name:"reflect_horz",
			actionString:
			[
				"/version 3",
				"/name [ 12",
				"	7265666c6563745f686f727a",
				"]",
				"/isOpen 0",
				"/actionCount 1",
				"/action-1 {",
				"	/name [ 12",
				"		7265666c6563745f686f727a",
				"	]",
				"	/keyIndex 0",
				"	/colorIndex 0",
				"	/isOpen 1",
				"	/eventCount 1",
				"	/event-1 {",
				"		/useRulersIn1stQuadrant 0",
				"		/internalName (adobe_reflect)",
				"		/localizedName [ 7",
				"			5265666c656374",
				"		]",
				"		/isOpen 0",
				"		/isOn 1",
				"		/hasDialog 1",
				"		/showDialog 0",
				"		/parameterCount 2",
				"		/parameter-1 {",
				"			/key 1634625388",
				"			/showInPalette 4294967295",
				"			/type (unit real)",
				"			/value -90.0",
				"			/unit 591490663",
				"		}",
				"		/parameter-2 {",
				"			/key 1668247673",
				"			/showInPalette 4294967295",
				"			/type (boolean)",
				"			/value 0",
				"		}",
				"	}",
				"}",
			]
		}
	}

	var layerActions =
	{
		"[ O ]": function(lay)
		{
			myItem = lay.groupItems[0];
			translateArtwork(myItem,"right");
			lay.hasSelectedArtwork = true;
			app.executeMenuCommand("group");
			myItem = lay.groupItems[0];
			translateArtwork(myItem,"down");
			lay.hasSelectedArtwork = true;
			app.executeMenuCommand("group");
			lay.groupItems[0].name = "[ O ]";
		},
		"[ = ]":function(lay)
		{
			myItem = lay.groupItems[0];
			translateAtwork(myItem,"down");
			lay.hasSelectedArtwork = true;
			app.executeMenuCommand("group");
			lay.groupItems[0].name = "[ = ]";
		},
		"<|>":function(lay)
		{
			myItem = lay.groupItems[0];
			translateArtwork(myItem,"right");
			lay.hasSelectedArtwork = true;
			app.executeMenuCommand("group");
			lay.groupItems[0].name = "<|>";
		}

	}
	


	hudLayer = findSpecificLayer(layers,hudLayerName);
	if(!hudLayer)
	{
		requiredLayerMissing(hudLayerName);
		return false;
	}

	guidesLayer = findSpecificLayer(layers,guidesLayerName);
	if(!guidesLayer)
	{
		requiredLayerMissing(guidesLayerName);
		return false;	
	}


	//find the center of the guides to be used for flipping
	//artwork across the central planes
	var centerPoint = getCenterPoint();


	
	var curLay;
	for(var hl = hudLayer.layers.length - 1; hl>=0; hl--)
	{
		curLay = hudLayer.layers[hl];
		if(!curLay.pageItems.length)
		{
			continue;
		}
		try
		{
			targetLayer = removeEffects(curLay)
			layerActions[targetLayer.name](targetLayer);
		}
		catch(e)
		{
			// alert("hmmm....");
		}
		docRef.selection = null;
	}
	// targetLayer = removeEffects(targetLayer);


	


	



	
}
doSomething();