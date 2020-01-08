
if ( "[ O ]" layer exists )
	{
		app.activeDocument.layers.getByName('[ O ]').pageItems.getByName('_ Delete _').remove(); 
		Disable "Transform" - FXs to [ O ] Layer. (or Reduce to Basic Appearance).
		var A1 = Select All elements inside [ O ] Layer. 
		var G1 = Duplicate the selected elements (A1) symmetrically to the right side and group them.
		var G2 = Duplicate G1 group symmetrically to the Downside.
		var G3 = Duplicate G2 group symmetrically to the left side.
		var G4 = Group all (G1 + G2 + G3 ) groups together.
		rename G4 Group to "[ O ]"
	}
	
	