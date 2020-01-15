function getActionFolder()
{
	var folderPath;

	var userChoice = Folder().selectDlg(undefined,"Select Location to Save Temporary Action Files");

	folderPath = userChoice.fsName;

	alert("Copy the path below and send back to William.\n" + folderPath);
}
getActionFolder();