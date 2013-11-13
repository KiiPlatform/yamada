#pragma strict

public static function Get (key : String, sort : Sort, callback : System.Action.<System.Object[]>)
{
	// Kii Cloud からスコア取得
	var ranking = [1,2,3,4,5];

    callback(ranking);
}


public static function Report(key : String, score : System.Object)
{
	// どこかでログインチェック
	// Kii Cloudへスコア送信
}

public enum Sort
{
    Asc,
    Desc,
}