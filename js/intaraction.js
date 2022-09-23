// 各入力フォームに何か入力があれば、ラベルにCSSを適用
$(".form-control").each(function () {
  const inputBlock = $(this).parent()
  if ($(this).val()) {
    $(inputBlock).find("label").css({
      top: "10px",
      fontSize: "14px",
    })
  }
})

// 入力フォームにフォーカスが当たると親要素にクラスfocusを付与
// 0.3秒で左上に小さく移動
$(".form-control").focus(function () {
  $(this).parent(".input-block").addClass("focus")
  $(this).parent().find("label").animate(
    {
      top: "10px",
      fontSize: "14px",
    },
    300
  )
})

// もし入力フォームに値が無ければクラスfocusを削除し元の位置に戻す
$(".form-control").blur(function () {
  if ($(this).val().length == 0) {
    $(this).parent(".input-block").removeClass("focus")
    $(this).parent().find("label").animate(
      {
        top: "25px",
        fontSize: "18px",
      },
      300
    )
  }
})
