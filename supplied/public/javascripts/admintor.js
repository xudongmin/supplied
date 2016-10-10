//  标签tbs
$(".navbar-right").find(".clickli").on("click",function(){
    $(".uploadify-queue-item,.submitfile").hide();
    $(".successtip").remove();
    $(this).parents(".wrap").find("form").each(function() {
        $(this).find("input[type='reset']").trigger("click");
    }); //表单重置
    var thisId = $(this).find("a").attr("href");
    var thisClass = $(this).attr("class");
    var parents_tabs = $(".parents-tabs");
    $(this).find("a").css({"color":"rgb(242, 88, 88)"});
    $(this).parents(".ad-container").find(".clickli").not(this).find("a").css({"color":"#777"});
    if(thisClass === "mange-det-li clickli") {
        $(this).parents(".mange-li").siblings("li").find("a").css({"color":"#777"});
    }
    parents_tabs.find(thisId).show();
    parents_tabs.find(thisId).siblings(".child-tabs").hide();
    return false;
});   

//调用日期控件
srmObj.dareselect();

//时分秒日期控件
$('.datetimepickerhms').datetimepicker({
    language:  'zh-CN',
    Format: 'Custom',
    todayBtn:  1,
    autoclose: 1,
    CustomFormat: "yyyy-MM-dd HH:mm"
});

// 招标公告发布附件上传
$('#zb_file_input').uploadify({
    'fileTypeDesc' : 'Image Files',
    'buttonText': '上传附件',
    'progressData'    : 'percentage',
    'fileTypeExts' : '*.jpg;*.gif;*.bmp;*.doc;*.xls;*.docx;*.xlsx;*.txt;*.pdf;*.ppt;*.pptx;*.rar;*.dwg;*.vsd;*.eml;*.msg',
    'swf': '/javascripts/jquery.uploadify-v3.2/uploadify.swf',
    'uploader' : '../SrmHome/SrmAdministration.jsp?__METHOD=upload_zbFile',
    'cancelImg': '/javascripts/jquery.uploadify-v3.2/uploadify-cancel.png',
    'fileObjName' : 'zbfileinput',
    'removeCompleted' : false,
    'auto': false,
    'multi': true,
    'onSelect':function(){
        if($(".uploadify-queue").length !== 0) {
                $(".successtip").remove();
                $(".submitfile").show();
                $(".uploadify-queue").next("span").remove();
                $(".uploadify-queue").after("<span style='color:#E21E1E;' class='addtip'>点击上传按钮上传附件</span>");
                $(".singupbtn").prop("disabled",true);
            }
            $("body").css({"overflow-y":"auto"});
    },
    'onCancel':function() {
        setTimeout("srmObj.sethide('.singupbtn')",3000);
    },
    'onFallback':function(){      
        alert("您未安装FLASH控件，无法上传！请安装FLASH控件后再试。");      
    },
    'onUploadSuccess':function(file, data, response) {
        data=$.parseJSON(data);
        var trHtml;
        trHtml = "<tr style='display:none;'><td>ID</td><td><input type='text' name='fileidlist' value='" + data.file_id + "' readonly/></td></tr>" +   
        "<tr style='display:none;'><td>附件名</td><td><input type='text' name='filenamelist' value='" + data.filename + "' readonly/></td></tr>";
        $(".addClassfile").find(".addfiletable").find("tbody").append(trHtml);
    },
   'onQueueComplete': function (queueData) { //当上传队列中的所有文件都完成上传时触发  
        $(".submitfile").siblings(".successtip").remove();
        $(".uploadify-queue").next("span").remove();
        $(".singupbtn").prop("disabled",false);
        $(".submitfile").before("<span class='successtip'>" + queueData.uploadsSuccessful + "个文件上传成功了！</span>");
    }  
});