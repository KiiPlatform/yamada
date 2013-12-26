static function GetRankingText(score : int, kiiScore : int[]){

			var rankingTexts = "Ranking";
	    
	    	if (Application.systemLanguage == SystemLanguage.Japanese) {
	    		rankingTexts = "らんきんぐ";
	    	}
	    		rankingTexts += "\n\n";
	         for (var i = 0; i < Mathf.Clamp(kiiScore.length, 0, 10); i++) {
	         
	         	var text = String.Format("{0} : {1}", i + 1, kiiScore[i]);
	         
	         	if( score == kiiScore[i] ){
	         		if (Application.systemLanguage == SystemLanguage.Japanese) {
	         			text = String.Format("<color=red> {0} <- あなた</color>", text);
	         		}else{
	         			text = String.Format("<color=red> {0} <- YOU</color>", text);
	         		}
	         	}
	         	rankingTexts += text +"\n";
	         }
	return rankingTexts;
}