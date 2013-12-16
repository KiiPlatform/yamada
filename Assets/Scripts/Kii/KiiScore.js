#pragma strict
import System;
import KiiCorp.Cloud.Storage;

public static function Init()
{
    // Kii Cloud SDKの初期化
    Kii.Initialize("__APP_ID__", "__APP_KEY__", Kii.Site.JP);

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
    var idSeed = UnityEngine.Random.value * 10000000;
    var username : String = "user_" + idSeed;
    
    var builder : KiiUser.Builder;
    builder = KiiUser.BuilderWithName(username);
    var user : KiiUser = builder.Build();

    Debug.Log("Start signup");
    user.Register("123456", function(u : KiiUser, err : Exception) {
        Debug.Log("End signup");
        if (err != null) {
            // Sign-up failed for some reasons.
            // Please check Exception to see what went wrong...
            Debug.Log("Signup failed " + err);
            return;
        }
        PlayerPrefs.SetString("KiiUsername", username);
        PlayerPrefs.SetString("KiiToken", KiiUser.AccessToken);
    });
}

public static function LogIn(token : String)
{
    Debug.Log("Start login token=" + token);
    KiiUser.LoginWithToken(token, function(user : KiiUser, err) {
        Debug.Log("End login");
        if (err != null) {
            // Log-in failed for some reasons.
            // Please check Exception to see what went wrong...        
            Debug.Log("Login failed " + err);
            return;
        }
    });
}

public static function Get (key : String, sort : Sort, callback : System.Action.<System.Object[]>)
{
    // Kii Cloud からスコア取得
    var bucket : KiiBucket = Kii.Bucket("topScores2");
    var query : KiiQuery = new KiiQuery(null);
    if (sort == Sort.Asc) {
        query.SortByAsc("score");
    } else {
        query.SortByDesc("score");
    }
    
    bucket.Query(query, function(result : KiiQueryResult.<KiiObject>, err) {
        if (err != null) {
            Debug.Log("error!" + err);
            callback([]);        
            return;
        }
        var ranking = new int[result.Count];
        for (var i = 0 ; i < result.Count ; ++i) {
            var obj = result[i];
            ranking[i] = obj.GetInt("score");
        }
        callback(ranking);    
    });
}

public static function Report(key : String, score : System.Object)
{
    // どこかでログインチェック
    var token : String = KiiUser.AccessToken;
    if (token == null || token.Length == 0) {
       return;
    }
    
    // Kii Cloudへスコア送信
    var segments : String[] = KiiUser.CurrentUser.Uri.Segments; 
    var uri : Uri = new Uri("kiicloud://buckets/topScores2/objects/" +
                  segments[segments.Length - 1]);
    var obj : KiiObject = KiiObject.CreateByUri(uri);
    obj[key] = score;

    Debug.Log("start uploading");
    obj.SaveAllFields(true, function(o : KiiObject, err) {
        if (err != null) {
            Debug.Log("failed to save " + err);
            return;
        }
        Debug.Log("end uploading");
    });
}

public enum Sort
{
    Asc,
    Desc,
}
