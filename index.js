// 関連パッケージの読み込み
const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql')
const cors = require('cors')

// アクセス先のポート番号を定義
const port = 3000

// expressインスタンスの生成
const app = express()
// JSON形式に変換
app.use(express.json())
// もしくは配列型に変換
app.use(express.urlencoded({
	extend: true
}))

// VSCodeのLiveServerオリジンを許可する
app.use(cors({
	origin: 'http://127.0.0.1:5500',
	// レスポンスヘッダーにAccess-Control-Allow-Credentialsを追加
	credentials: true,
	// レスポンスのステータスコードを200に設定
	optionsSuccessStatus: 200
  }))


// 最もシンプルなログ形式で出力
app.use(morgan('tiny'))

// DB接続の設定(本来リソースは環境変数へ移動)
const connection = mysql.createConnection({
	host: 'localhost',
	// port: 3306, // Win用port番号
	port: 8889,
	user: 'root',
	// password: '', // Win用パスワード
	password: 'root',
	database: 'expressdb',
	stringifyObjects: true // SQLインジェクション対策
})

const errorHandler = (error) => {
	if (!error) return
	if (error) {
		console.log(error)
		res.status(500).send('システムエラー')
		return
	}

}

// 接続されたインスタンスを元にコールバック関数
connection.connect((err) => {
	// エラーオブジェクトが返ったらメッセージを上積み(stack)していく
	if (err) {
		console.log('接続失敗: ' + err.stack)
		return
	}
	console.log('接続成功！')
})

app.get('/todos', (req, res) => {
	connection.query('SELECT * FROM todos WHERE deleted_at IS NULL',
		(error, result) => {
			errorHandler(error)
			res.json(result)
		}
	)
})

app.post('/todos', (req, res) => {
	const todos = {
		status: req.body.status,
		task: req.body.task
	}
	connection.query('INSERT INTO todos (status, task) VALUES (?, ?)',
		[todos.status, todos.task],
		(error, result) => {
			errorHandler(error)
			res.send('登録完了!')
		}
	)
})

app.put('/todos/:id', (req, res) => {~
	// 編集予定のパラメータIDを取得
	const id = req.params.id
	const todos = {
		status: req.body.status,
		task: req.body.task
	}
	connection.query(
		'UPDATE todos SET status = ?, task = ? WHERE id = ? AND deleted_at IS NULL',
		// 取得した各データを疑問符プレースホルダーにバインドする
		[todos.status, todos.task, id],
		(error, result) => {
			errorHandler(error)
			res.send('更新完了!')
		}
	)
})

app.delete('/todos/:id', (req, res) => {
	const id = req.params.id
	connection.query(
		'UPDATE todos SET deleted_at = ? WHERE id = ?',
		[new Date(), id],
		(error, result) => {
			errorHandler(error)
			res.send('削除完了!')
		}
	)
})

// ポート番号を付与したアクセスURLを実行
app.listen(port, () => {
	console.log(`ExpressCRUD App listening at http://localhost:${port}`)
})