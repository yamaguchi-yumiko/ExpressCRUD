// DOMの取得
const todosList = document.querySelector('#todos') // タスク一覧
const error = document.querySelector('#error') // エラー出力
const todoTask = document.querySelector('#input-todo') // 入力タスク
const select = document.querySelector('#input-status') // タスクの状態
const submitBtn = document.querySelector('#submitBtn') // 追加ボタン
const cancelBtn = document.querySelector('#cancelBtn') // キャンセルボタン
const editBtn = document.querySelector('#editBtn') // 編集ボタン
const editId = document.querySelector('#edit-id') // 編集時のid
const deleteBtn = document.querySelector('#deleteBtn') // 削除ボタン
const urlDomain = 'http://localhost:3000'
const progress = document.querySelector('#progress') // 完了済みゲージ
const offset = document.querySelector('#offset') // 完了数
console.log(progress)
console.log(offset)

// DOM取得の確認
// const group = 'background-color:#333;padding:5px 10px;font-weight:bold;font-size:12px;border-radius:3px'
// const code = 'background-color:#000;padding:0 10px;border-radius:3px'
// console.group('%c出力値', group)
// console.log('%c1:todosList タスク一覧:\n' + todosList.innerHTML, code)
// console.log('%c1:error エラー出力:\n' + error.innerHTML, code)
// console.groupEnd('%c出力値')
// console.group('%c入力値', group)
// console.log('%c2:todoTask 入力タスク:\n' + todoTask.innerHTML, code)
// console.log('%c3:select タスクの状態:\n' + select.innerHTML, code)
// console.groupEnd('%c入力値')
// console.group('%c上部表示ボタン', group)
// console.log('%c4:submitBtn 追加ボタン:\n' + submitBtn.innerHTML, code)
// console.log('%c5:cancelBtn キャンセルボタン:\n' + cancelBtn.innerHTML, code)
// console.groupEnd('上部表示ボタン')
// console.group('%cリストボタン', group)
// console.log('%c6:editBtn 編集ボタン:\n' + editBtn.innerHTML, code)
// console.log('%c7:editId 編集時のid:\n' + editId.innerHTML, code) // 描画時はnull
// console.log('%c8:deleteBtn 削除ボタン:\n' + deleteBtn.innerHTML, code)
// console.groupEnd('リストボタン')


// // 一覧を非同期で取得
// const getTodos = async () => {
// 	// fetchで取得したJSONをオブジェクトに変換
// 	const result = await fetch(`http://localhost:3000/todos`)
// 	const todos = await result.json()
// }


// セレクトボックスの番号に応じた出力文字に変換
const getStatusJa = (status) =>
	status === 1 ?
	'[ 未完了 ]' :
	status === 2 ?
	'[ 作業中 ]' :
	status === 3 ?
	'[ 保　留 ]' :
	'[ 完了済 ]'

const getStatusEn = (status) =>
	status === 1 ?
	'IMCOMPLETE' :
	status === 2 ?
	'PROGRESS' :
	status === 3 ?
	'PENDING' :
	'COMPLETE'


// 一覧を非同期で取得
const getTodos = async () => {
	let compTotal = 0;
	let todoTotal = 0;
	// テンプレートリテラルでオリジンを変数展開
	const result = await fetch(`${urlDomain}/todos`)
	const todos = await result.json()

	// ulのリストが1つでもあれば一度全て削除
	while (todosList.firstChild) {
		todosList.removeChild(todosList.firstChild)
	}

	// Todoタスクの値を初期化
	todoTask.value = ''

	// タスクの数だけ繰り返し作成
	todos.forEach((todo) => {
		// 要素の作成
		const li = document.createElement('li')
		// クラスの付与
		li.classList.add('todo')
		const strong = document.createElement('strong')
		strong.classList.add('status')
		const span = document.createElement('span')
		span.classList.add('en')
		const br = document.createElement('br')
		// タスクリストを構築
		// タスクリストを構築
		span.textContent = getStatusEn(todo.status)
		strong.textContent = getStatusJa(todo.status)
		// span.textContent = 'IMCOMPLETE'
		// strong.textContent = '[ 未完了 ]'
		strong.appendChild(br)
		strong.appendChild(span)
		li.appendChild(strong)

		// 見出しの追加
		const h2 = document.createElement('h2')
		h2.classList.add('todo-title')
		// データベースのtaskカラムから1件を見出しに追加
		h2.textContent = todo.task
		li.appendChild(h2)

		// 編集ボタンの追加
		const editBtn = document.createElement('button')
		editBtn.id = 'editBtn'
		editBtn.classList.add('btn', 'btn-success', 'todo-button')
		const icon_repeat = document.createElement('i')
		icon_repeat.classList.add('fa', 'fa-repeat')
		// ボタンにラベルを追加
		editBtn.textContent = 'EDIT'
		// ラベルの手前にアイコンを追加
		editBtn.insertBefore(icon_repeat, editBtn.firstChild)
		li.appendChild(editBtn)

		// 編集ボタンをクリックしたらフォームに値を渡す
		editBtn.addEventListener('click', () => {
			editForm({
				id: todo.id,
				task: todo.task,
				status: todo.status,
			})
		})

		// 削除ボタンの追加
		const deleteBtn = document.createElement('button')
		deleteBtn.id = 'deleteBtn'
		deleteBtn.classList.add('btn', 'btn-success', 'todo-button')
		const icon_trash = document.createElement('i')
		icon_trash.classList.add('fa', 'fa-trash-o')
		// ボタンにラベルを追加
		deleteBtn.textContent = 'DELETE'
		// ラベルの手前にアイコンを追加
		deleteBtn.insertBefore(icon_trash, deleteBtn.firstChild)
		li.appendChild(deleteBtn)

		// 削除ボタンをクリックしたらidを元に削除する
		deleteBtn.addEventListener('click', () => {
			// フェードで消えるCSSのクラスを親要素に付与
			deleteBtn.parentElement.classList.add('bounce')
			// アニメーション後に削除
			setTimeout(() => {
				deleteTodo(todo.id)
			}, 1200)
		})

		// 完了済みのカウント
		todoTotal++
		if (todo.status === 4) {
			compTotal++
			li.classList.add('translucent')
			h2.classList.add('del')
		}
		// 繰り返しulに追加
		todosList.appendChild(li)
	})

	const count = document.createElement('strong')
	const percent = document.createElement('strong')
	count.innerText = compTotal
	// 達成率を計算
	const percentNum = Math.ceil(compTotal / todoTotal * 100)
	percent.innerText = percentNum
	offset.innerText = '達成数'
	offset.appendChild(count)
	offset.innerHTML += '個 / '
	offset.appendChild(percent)
	offset.innerHTML += '%'
	// プログレスバーの長さを変更
	progress.style.width = `${ percentNum }%`
}

// 画面が表示されたタイミングで一覧を取得
window.addEventListener('load', getTodos)

// POSTメソッドでデータを追加するAPI
const createTodo = async () => {
	const value = todoTask.value
	const status = select.value
	if (!value || !status) {
		error.textContent = '両方の値を指定してください'
		return false;
	}
	await fetch(`${urlDomain}/todos`, {
		method: 'POST',
		// JSONでAPIリクエストする際はヘッダー情報が必要
		headers: {
			'Content-Type': 'application/json'
		},
		// bodyにデータを送る際にオブジェクトをJSONに変換
		body: JSON.stringify({
			task: value,
			status
		})
	})
	// todo登録後、再度一覧を取得し再描画
	await getTodos()
}

// 編集時にフォームに値を渡す
const editForm = ({
	id,
	task,
	status
}) => {
	// 隠しフォームにidを追加
	editId.value = id
	// 入力フォームをフォーカスし文字エフェクトを起動
	todoTask.value = task
	todoTask.focus()
	// 選択値を元にセレクトボックスを選択
	select.options[status].selected = true;
	select.focus()
	submitBtn.innerHTML = '<button id="editBtn" class="square-button"><i class="fa fa-repeat"></i>EDIT</button>'
}

// キャンセルボタンで値の初期化
const clearTask = () => {
	editId = ''
	todoTask = ''
	status = ''
	submitBtn.innerHTML = '<button id="submitBtn" class="square-button"><i class="fa fa-plus"></i>CREATE</button>'
}

// 送信ボタンの実行処理
submitBtn.addEventListener('click', async () => {
	// ラベルの表示によって編集か追加の処理を振り分け
	// 指定文字が含まれていれば0いなければ-1を返す
	if (submitBtn.textContent.indexOf('EDIT') === 0) {
		await editTodo()
	} else {
		await createTodo()
	}
	// 実行後に値を初期化
	clearTask()
})

// キャンセルボタンで値を初期化
cancelBtn.addEventListener('click', clearTask)

// PUTメソッドでデータを更新するAPI
const editTodo = async () => {
	// 隠しフォームから編集用のIDを取得
	const id = editId.value
	const value = todoTask.value
	const status = select.value
	if (!value || !status) {
		error.textContent = '両方の値を指定してください'
		return false;
	}
	await fetch(`${urlDomain}/todos/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			task: value,
			status
		})
	})
}

// DELETEメソッドでデータを論理削除するAPI
const deleteTodo = async (id) => {
	await fetch(`${urlDomain}/todos/${id}`, {
		method: 'DELETE',
	})
	await getTodos()
}