#pragma strict
import KiiCorp.Cloud.Storage;

public static function Init()
{
    // Kii Cloud SDKの初期化
    Kii.Initialize("b1194c83", "446f6c923449b33c592b88908bc84ad2", Kii.Site.JP);

    // ログイン
    var token : String = PlayerPrefs.GetString("KiiToken", null);
    if (token == null || token.Length == 0) {
	KiiScore.SignUp();
    } else {
	KiiScore.LogIn(token);
    }
}

public static function SignUp()
{
    var idSeed = Random.value * 10000000;
    var username : String = "user_" + idSeed;
    
    var builder : KiiUser.Builder;
    builder = KiiUser.BuilderWithName(username);
    var user : KiiUser = builder.Build();

    try
    {
	Debug.Log("Start signup");
	user.Register("123456");
	Debug.Log("End signup");

	Debug.Log("Start login");
	KiiUser.LogIn(username, "123456");
	PlayerPrefs.SetString("KiiUsername", username);
	PlayerPrefs.SetString("KiiToken", KiiUser.AccessToken);
	Debug.Log("End login");
    }
    catch (err)
    {
	Debug.Log("Signup failed " + err);
	// Sign-up failed for some reasons.
	// Please check Exception to see what went wrong...
    }
}

public static function LogIn(token : String)
{
    try
    {
	Debug.Log("Start login token=" + token);
	KiiUser.LoginWithToken(token);
	Debug.Log("End login");
    }
    catch (err)
    {
	Debug.Log("Login failed " + err);
	// Log-in failed for some reasons.
	// Please check Exception to see what went wrong...
    }    
}

public static function Get (key : String, sort : Sort, callback : System.Action.<System.Object[]>)
{
    // Kii Cloud からスコア取得
    var bucket : KiiBucket = Kii.Bucket("topScores");
    var query : KiiQuery = new KiiQuery(null);
    if (sort == Sort.Asc) {
	query.SortByAsc("score");
    } else {
	query.SortByDesc("score");
    }

    try {
	var result : KiiQueryResult.<KiiObject> = bucket.Query(query);
	var ranking = new int[result.Count];
	for (var i = 0 ; i < result.Count ; ++i) {
	    var obj = result[i];
	    ranking[i] = obj.GetInt("score");
	}
	callback(ranking);
    } catch (err) {
	Debug.Log("error!" + err);
	callback([]);
    }

}


public static function Report(key : String, score : System.Object)
{
    // どこかでログインチェック
    var token : String = KiiUser.AccessToken;
    if (token == null || token.Length == 0) {
	return;
    }

    Debug.Log("start uploading");
    // Kii Cloudへスコア送信
    var bucket : KiiBucket = Kii.Bucket("topScores");
    var obj : KiiObject = bucket.NewKiiObject();
    obj[key] = score;

    try
    {
	obj.Save();
	Debug.Log("end uploading");
    }
    catch (err)
    {
	Debug.Log("failed to save");
    }	    
}

public enum Sort
{
    Asc,
    Desc,
}
