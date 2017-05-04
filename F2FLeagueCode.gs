// **********************************************
// function fcnGameResults()
//
// This function populates the Game Results tab 
// once a player submitted his Form
//
// **********************************************

function fcnGameResults() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Form Responses Sheet Variables
  var RspnSht = ss.getSheetByName('Form Responses 11');
  var RspnMaxRows = RspnSht.getMaxRows();
  var RspnStartRow = 2;
  var RspnLastPrcssdRow = RspnSht.getRange(1, 28).getValue() + 1;
  var RspnWeekNum;
  var RspnDataWeek;
  var RspnDataPlyrA;
  var RspnDataPlyrB;
  var RspnPrcssd;
  var RspnDataInputs = 24;
  var RspnDataPrcssd = 0;
  var ResponseData;

  var MatchWeekNum;
  var MatchPlyrA;
  var MatchPlyrB;
  var MatchData;
  
  var DataConflict = 0;
  
  var TestSht = ss.getSheetByName('Test') ; 

  // Match Results Sheet Variables
  var RsltSht = ss.getSheetByName('Match Results');
  var RsltShtMaxRows = RsltSht.getMaxRows();
  
  // Find a Row that is not processed in the Response Sheet (added data)
  for (var NewRow = RspnLastPrcssdRow; NewRow <= RspnMaxRows; NewRow++){
    RspnWeekNum = RspnSht.getRange(NewRow, 2).getValue();
    RspnPrcssd = RspnSht.getRange(NewRow, 27).getValue();
    
    // If week number is not empty and Processed is empty, Match Data needs to be processed
    if (RspnWeekNum != '' && RspnPrcssd == ''){
      
      RspnDataPrcssd = 1;
      Logger.log('New Data Found at Row: %s',NewRow);
                 
      // Copy All Input Data
      ResponseData = RspnSht.getRange(NewRow, 2, 1, RspnDataInputs).getValues();
      RspnDataWeek = ResponseData[0][0];
      RspnDataPlyrA = ResponseData[0][2];
      RspnDataPlyrB = ResponseData[0][3];
      
      // Loop to find if the other player posted the game results
      for (var MatchRow = RspnStartRow; MatchRow <= RspnMaxRows; MatchRow++){
        MatchWeekNum = RspnSht.getRange(MatchRow, 2).getValue();
        MatchPlyrA = RspnSht.getRange(MatchRow, 4).getValue();
        MatchPlyrB = RspnSht.getRange(MatchRow, 5).getValue();
        
        // If Week Number, Player A and Player B are matching, we found the other match to compare data to
        if (MatchRow != NewRow && MatchWeekNum == RspnDataWeek && MatchPlyrA == RspnDataPlyrA && MatchPlyrB == RspnDataPlyrB){
          
          MatchData = RspnSht.getRange(MatchRow, 2, 1, RspnDataInputs).getValues();
          
          for (var i = 4; i < RspnDataInputs - 1; i++){
            // Compare New Response Data and Match Data. If Data is not equal to the other
            if (i != 6 && ResponseData[0][i] != MatchData[0][i]) {
              DataConflict = 1;
              // Sets the Conflict Flag to the Data ID value and send email to Eric and Chris
              RspnSht.getRange(NewRow, 29).setValue(i+1);
              RspnSht.getRange(MatchRow, 29).setValue(i+1);
              
              // Send email below
            }
          }
          
          if (DataConflict == 0){
            // Sets Conflict Flag to 'No Conflict'
            RspnSht.getRange(NewRow, 29).setValue('No Conflict');
            RspnSht.getRange(MatchRow, 29).setValue('No Conflict');
            // Copy Data to Match Result Sheet
            
          }
          
          TestSht.getRange(NewRow, 1).setValue('Match Found');
          TestSht.getRange(NewRow, 2, 1, RspnDataInputs).setValues(ResponseData);
          TestSht.getRange(NewRow +10, 1).setValue(MatchRow);
          TestSht.getRange(NewRow +10, 2, 1, RspnDataInputs).setValues(MatchData);
          
        }
        else{
          TestSht.getRange(NewRow, 1).setValue('Match Not Found');
          TestSht.getRange(NewRow, 2, 1, RspnDataInputs).setValues(ResponseData);
        }
        if(MatchWeekNum == '' || RspnDataPrcssd == 1) {
          Logger.log('Loop Exits at Row %s',MatchRow);
          MatchRow = RspnMaxRows + 1;
        }
      }
      
      // Sets the Processed Flag and the Last Processed Row
      RspnSht.getRange(NewRow, 27).setValue(RspnDataPrcssd);
      RspnSht.getRange(1, 28).setValue(NewRow);
      
      // When Week Number is empty, we have reached the end of the list, then exit the loop
      if(RspnWeekNum == '' || RspnDataPrcssd == 1) NewRow = RspnMaxRows + 1;
    }
  }
}


// **********************************************
// function fcnPopGameResults()
//
// Once both players have submitted their forms 
// the data in the Game Results tab are copied into
// the Week X tab
//
// **********************************************

function fcnPopRoundScores() {
}


