#pragma strict

var skin : GUISkin;
var bgTexture : Texture2D;
private var openWindow : boolean;
private var kiiScore : int[];
private var alpha = 1.0;

private var stringTitle : String;

function Awake() {
    if (Application.systemLanguage == SystemLanguage.Japanese) {
        stringTitle = "やまだゲーム\n\n\nタップしてスタート";
    } else {
        stringTitle = "YAMADA GAME\n\n\nTAP TO START";
    }
}

function Update() {
    alpha = Mathf.Max(alpha - Timekeeper.delta * 4.0, 0.0);

    if (Input.GetMouseButtonDown(0) && Input.mousePosition.y < 0.8 * Screen.height) {
        // Broadcasts game starting message.
        GameObject.FindWithTag("Player").BroadcastMessage("OnGameStart");
        GameObject.FindWithTag("GameController").BroadcastMessage("OnGameStart");
        // Terminates itself.
        Destroy(gameObject);
    }
}

function OnGUI() {
    var sw = Screen.width;
    var sh = Screen.height;
    var scale = Config.GetUIScale();

    GUI.skin = skin;

    if (GUI.Button(Rect(4, 4, 0.1 * sw , 0.1 * sw), "", "leaderboard")) {

        if (!openWindow) {
            KiiScore.Get("score", Sort.Desc, function(s) {
                kiiScore = s;
                openWindow = true;
            });
        } else {
            openWindow = false;
        }
    }

	if (openWindow) {
	        var rankingTexts = Ranking.GetRankingText(-1,kiiScore);
	        GUIUtility.ScaleAroundPivot(Vector2(1.0 / scale, 1.0 / scale), Vector2.zero);
	        GUILayout.Space(24);
	        GUILayout.Label(rankingTexts, "ranking");
	}

    GUIUtility.ScaleAroundPivot(Vector2(1.0 / scale, 1.0 / scale), Vector2(0, 0));
    GUI.Label(Rect(0, sh * scale * 0.5, sw * scale, sh * scale * 0.5), stringTitle);

    if (alpha > 0.0) {
        GUI.color = Color(1, 1, 1, alpha);
        GUI.DrawTexture(Rect(0, 0, sw, sh), bgTexture);
    }
}
