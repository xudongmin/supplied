/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
jQuery.extend(jQuery.validator.messages, {
        required: "必选字段",
		remote: "请修正该字段",
                telnumfalse: "请输入正确的电话号码格式",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
		min: jQuery.validator.format("请输入一个最小为 {0} 的值")
});
$.validator.addMethod("isPositive",function(value,element){
                var score = /^[0-9]\d*(\.\d+)?$/;
                return this.optional(element) || (score.test(value));
            },"<font color='#E47068'>请输入合法数字且不能为负数</font>");
$.validator.addMethod("notEqualTo", function(value, element, param) {
return value.toLowerCase() !== $(param).val().toLowerCase();
}, $.validator.format("不能输入重复值")); 

$.validator.addMethod("telnumsvalidate",function(tel) {
    var mobile = /^1[3|4|5|7|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
},"请输入正确的电话号码格式");

jQuery.extend(jQuery.validator.defaults,{
    errorElement: "span",
    errorPlacement: function(error,element) {
        if (element.is(':radio') || element.is(':checkbox')) {
            var eid = element.attr('name');
            //alert(error);
            //$('input[name=' + eid + ']:last').next().after(error);
            if($(".error:last",element.parent()).is("span")==false){
            	//error=error.text("必选字段");
            	error.appendTo(element.parent());
            	//element.parent().addClass("error");
            }
        }else{
        	error=error.text("");
        	error.insertAfter(element);
        }
    }
});
