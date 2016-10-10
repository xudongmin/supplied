var srmObj = {};
//  bars 按钮点击显示菜单导航
    $(".showbars").on("click", function() {
        $(this).parents(".logined-nav-header").siblings(".logined-nav").slideToggle();
    });

//  窗口宽度变化，显示导航菜单 
    srmObj.logined_nav = $(".logined-nav");
    $(window).resize(function() {
        thisWidth = $(window).width();
        if (thisWidth >= 1200) {
            srmObj.logined_nav.show();
        } else {
            srmObj.logined_nav.hide();
        }
    });
    
//  模态框 恢复按钮可用
    srmObj.removeDisabled = function(Class) {
        $("." + Class).find(".singupbtn").removeAttr("disabled");
    };

//  关闭按钮 恢复表单
    srmObj.addAgreebutton = function() {
        $(".providesignup-modal").find(".agree,.singupbtn,.showclose").show();
        $(".providesignup-modal").find("input[type='checkbox']").removeAttr("checked");
        srmObj.removeDisabled("providesignup-modal");
    };

//  #myModal模态框关闭按钮事件
    $(".providesignup-modal").on("click", "button[data-dismiss='modal']", function() {
        $("#SignUp").parents("#sinupform").remove();
        $(".agree").find(".agree-tip").remove();
        srmObj.addAgreebutton();
    });
    
    //表单提交验证
    srmObj.formvalidator = function(id,url) {
        $(id).validate({
            focusCleanup:true
        });
        if($(id).valid()){
            focusCleanup:true;
            $(id).attr("action", url);
            $(id).submit();
        }
    };
    
    //取消上传队列初始化
    srmObj.sethide = function(recoverbtn) {
        if($(".uploadify-queue").find(".uploadify-queue-item").length === 0) {
            $(".submitfile").hide();
            $(".uploadify-queue").siblings(".addtip").remove();
            $(recoverbtn).prop("disabled",false);
        }
    };
//    报名上传附件插件
    srmObj.addfiles = function() {
        $("#pon_file_input").uploadify({
                'fileTypeDesc' : 'Image Files',
                'buttonText': '上传报名附件',
                'progressData'    : 'percentage',
                'fileTypeExts' : '*.jpg;*.gif;*.bmp;*.doc;*.xls;*.docx;*.xlsx;*.txt;*.pdf;*.ppt;*.pptx;*.rar;*.dwg;*.vsd;*.eml;*.msg',
                'swf': '../public/js/jquery.uploadify-v3.2/uploadify.swf',
                'uploader' : '../SrmHome/Login.jsp?__METHOD=upload_ponFile',
                'cancelImg': '../public/js/jquery.uploadify-v3.2/uploadify-cancel.png',
                'fileObjName' : 'ponfileinput',
                'removeCompleted' : false,
                'auto': false,
                'multi': true,
                'onSelect':function(){
                    if($(".uploadify-queue").length !== 0) {
                        $(".successtip").remove();
                        $(".submitfile").show();
                        $(".uploadify-queue").next("span").remove();
                        $(".uploadify-queue").after("<span style='color:#E21E1E;' class='addtip'>点击上传按钮上传附件</span>");
                        $("#singdetail").prop("disabled",true);
                    }
                    $("body").css({"overflow-y":"auto"});
                },
                'onCancel':function() {
                        setTimeout("srmObj.sethide('#singdetail')",3000);
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
                    $("#singdetail").prop("disabled",false);
                    $(".submitfile").before("<span class='successtip'>" + queueData.uploadsSuccessful + "个文件上传成功了！</span>");  
                }  
            });
    };
//  点击参加报名，选择弹框
    $(".providesignup-modal").find(".purchas-footer").on("click", "#singup", function() {
        $("body").css({"overflow-y":"auto"});
        if ($(this).siblings(".agree").find("input[type='checkbox']").prop("checked") === true) {
            $(this).prop("disabled", "true");
            //项目名称
            var thisText = $(this).parents(".provide-modal").find(".purchas-info").find("table").eq(0).find("tr").find("td").eq(1).text();
            
            //项目ID
            var thisid = $(this).parents(".provide-modal").find(".purchas-info").find("table").eq(0).find("tr").find("td").eq(2).text();
            $(this).parents(".purchas-footer").find(".addform").html(
                "<div id='regTip'>提示：需注册过比亚迪供应商门户才能报名，如未注册，请点击<a href='../protocol/RegisterProtocol.jsp' target='_blank'>注册</a>前往比亚迪供应商门户注册</div>" +
                "<div id='SignUp'>" +
                "<div>" +
                "<div class='singup-modal' id='" + thisText + "'>" +
                "<div class='clearfix'>" +
                "<table class='table-striped table-bordered table-responsive Complaint-table singup-table'>" +
                "<tr>" +
                "<td class='first-child'>供应商编码</td>" +
                "<td style='display: none'><input name='zb_project_description' id ='zb_project_description' type='hidden' value='" + thisText + "'/></td>" +
                "<td style='display: none'><input name='zb_header_id' id ='zb_header_id' type='hidden' value='" + thisid + "'/></td>" +
                "<td class='lefttd'><input name='segment1' id ='segment1' type='text' readonly class='required'/></td>" +
                "<td class='first-child'><span class='text-danger'>*</span>联系邮箱</td>" +
                "<td class='lefttd'><input name = 'mail' id = 'mail' type='text' placeholder='请输入联系邮箱' class='required email'/></td>" +
                "</tr>" +
                "<tr>" +
                "<td class='first-child'><span class='text-danger'>*</span>供应商名称</td>" +
                "<td class='lefttd relativeparent'><input name='description' id='description' type='text' placeholder='请输入注册时的供应商名称，供应商编码自动带出' class='required'/></td>" +
                "<td class='first-child'><span class='text-danger'>*</span>是否给BYD供过货</td>" +
                "<td class='last-child-td lefttd'>" +
                "<label>" +
                "<input type='radio' name='status' value='是' class='select-radio' checked='checked'>" +
                " 是 </label>" +
                "<label>" +
                "<input type='radio' name='status' value='否' class='select-radio'>" +
                " 否 </label>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='first-child'><span class='text-danger'>*</span>联系人</td>" +
                "<td class='lefttd'><input name='contactor' id='contactor' type='text' placeholder='请输入联系人姓名' class='required'/></td>" +
                "<td class='first-child'>所供产品物料类型</td>" +
                "<td class='lefttd'><input type='text' name = 'item_type' id = 'item_type' placeholder='请输入物料类型'/></td>" +
                "</tr>" +
                "<tr>" +
                "<td class='first-child'><span class='text-danger'>*</span>联系电话</td>" +
                "<td class='lefttd'><input name='tel' id='tel' type='text' placeholder='请输入联系电话' class='required telnumsvalidate'/></td>" +
                "<td class='first-child'>备注</td>" +
                "<td class='lefttd'><input type='text' name='memo' id = 'memo' placeholder='请输入备注'/></td>" +
                "</tr>" +
                "</table>" +
                "<table class='table table-striped table-bordered table-responsice addfiletable'>" +
                "<tbody><tr>" +
                "<td><input type='file' name='ponfileinput' id='pon_file_input'/><button type='button' class='btn btn-default btn-sm submitfile' onclick='upload_pon_file()'>上传</button></td>" +
                "</tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "<div class='purchas-footer'>" +
                "<input type='reset' value='重置' class='btn btn-danger btn-sm'/>" +
                "<input class='btn btn-warning singupbtns btn-sm' value='提交' type='button' id='singdetail'/>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" 
            );   
            $(this).siblings(".agree").find(".agree-tip").remove();
            document.getElementById("agreefor").checked = false;
            $(this).siblings(".agree,button").hide();
            $(this).hide();
        } else {
                $(this).prop("disabled", "true");
                $(this).siblings(".agree").append("<p class='agree-tip'>请先阅读<a href='javascript:void(0);' class='text-primary'>《比亚迪供应商道德行为规范》</a>并且遵守勾选同意</p>");
            }
        srmObj.addfiles(); //添加上传附件
    });
    
// 点击投诉初始化addfiletable
    $(".addClassfile").find("button[data-dismiss='modal']").on("click",function() {
        $(this).parents(".addClassfile").find(".addfiletable").find("tr").not(":last").remove();
    });

//  checkbox 改变按钮disabled
    $(".agree").on("click", "input[type='checkbox']", function() {
        if ($(this).prop("checked") === true) {
            $(".agree-tip").remove();
            srmObj.removeDisabled("providesignup-modal");
        } else {
            $(this).parents(".agree").siblings(".singupbtn").prop("disabled");
        }
    });

//  删除行
    $(".over-long").on("click",".remove",function() {
        $(this).parents("tr").remove();
    });

//  阻止用户多次提交表单
    $("form").submit(function() {
        $(":submit", this).attr("disabled", "disabled");
    }); 
    
//    点击弹窗出现事件
    $("body").on("click",".showmodala",function() {
        if($(".modalvisble").is(":visible") === false) {
            $(".wrap").append("<div class='mask'></div>");
        };
        srmObj.stopcarousel();
        var thisClass = $(this).attr("class").split(" ")[0];
        $("." + thisClass).fadeIn(200);
    });
    
//      点击关闭窗口
    $(".showmodal").on("click","button[data-dismiss='modal']",function() {
        if($(this).parents(".showmodal").find(".uploadify-queue").length !==0) {
            $(this).parents(".showmodal").find(".submitfile").hide();
            $(this).parents(".showmodal").find(".uploadify-queue-item,.successtip").remove();
        }
//      重置表单
        if ($(this).parents("form").length !== 0) {
            $(this).parents("form")[0].reset();
        }
        $(this).parents(".showmodal").hide();
        if($(".modalvisble").is(":visible") === false) {
            $(".mask").remove();
            srmObj.starcarousel();
            $("body").css({"padding-right":"0","overflow-y":"auto"});
        }
    });

    $("a[data-toggle='toggle']").on("click",function() {
        srmObj.stopcarousel();
        $("body").css({"overflow-y":"hidden"});
    });
    
    $(".showmodal").on("click",".singupclose",function() {
        $(".uploadify-queue-item,.submitfile").remove();
        $(".successtip").remove();
        srmObj.addAgreebutton();
        $(this).parents(".providesignup-modal").hide();
        $(this).parents(".providesignup-modal").find(".addform").html("");
        if($(".modalvisble").is(":visible") === false) {
             $(".mask").remove();
        }
    });
    
//  分页
    srmObj.addPages = function(dataobj,Class) {
        $("."+ Class).find(".modal-body").append(
            "<ul class='pagination pull-right pagination-sm page-nums'>" +
            "<li class='pagereview first'><a href='javascript:void(0);'>首页</a></li>" +
            "<li class='pagereview previous'><a href='javascript:void(0);'>上一页</a></li>" +
            "<li class='pagereview next'><a href='javascript:void(0);'>下一页</a></li>" +
            "<li class='pagereview last'><a href='javascript:void(0);'>尾页</a></li>" +
            "<li class='numinput'><a href='javascript:void(0);'><input type='text' value='1' class='inputshow'></a></li>" +
            "<li class='pagereview location'><a href='javascript:void(0);'>跳转</a></li>" +
            "<li><a href='javascript:void(0);'>共 <span class='totalpagenum'></span> 页</a></li>" +
            "</ul>"
        );
        
        $("."+ Class).on("focus",".inputshow",function() {
            $(this).val('');
        });
    };
    
    $.ajax({
        type: "GET",
        url: "../main.json",
        dataType: "json", 
        success: function(data) {
//    最新动态窗口分页点击添加
            $(".addnewsmodal").on("click",".pagereview",function() {
                $(this).parents(".addnewsmodal").find(".content-ul").remove();
                var thisClass = $(this).attr("class");
                var thisnumber = parseInt($(this).siblings(".numinput").find("input").val()); //当前页码
                if(isNaN(thisnumber)) {
                    thisnumber = 1;
                    $(".numinput").find("input").val(1);
                }
                var dataLength = parseInt(data["news"].length); //所有数据条数
                var lastpagenum = Math.ceil(dataLength/5); //最后一页页码
                var forsize ; //循环条数
                var fromnum; //起始的条数num
                var liHtml;
                var newsArray = [];
                if(thisnumber === lastpagenum ) {
                    forsize = parseInt(dataLength - (thisnumber - 1)*5);
                } else {
                    forsize = 5;
                }
                switch(thisClass) {
                    //首页
                    case "pagereview first" :
                        $(".numinput").find("input").val(1);
                        thisnumber = parseInt($(".numinput").find("input").val()); //当前页码
                        if(thisnumber === lastpagenum) {
                            forsize = parseInt(dataLength - (thisnumber - 1)*5);
                        } else {
                            forsize = 5;
                        }
                        fromnum = 0;
                        break;
                    //上一页
                    case "pagereview previous" :
                        if(thisnumber !==1) {
                            if(thisnumber > lastpagenum) {
                                thisnumber = 2;
                            }
                            $(".numinput").find("input").val(thisnumber - 1);
                            thisnumber = parseInt($(".numinput").find("input").val()); //当前页码
                            fromnum = (thisnumber+1)*5 - 10;
                            if(thisnumber === lastpagenum) {
                                forsize = parseInt(dataLength - thisnumber*5);
                            } else {
                                forsize = 5;
                            }
                        } else {
                            fromnum = 0;
                        }
                        break;
                    //下一页
                    case "pagereview next" :
                        if(thisnumber !== lastpagenum) {
                            if(thisnumber > lastpagenum) {
                                thisnumber = lastpagenum -1;
                            }
                            $(".numinput").find("input").val(thisnumber + 1);
                            if(thisnumber + 1 === lastpagenum) {
                                forsize = parseInt(dataLength - thisnumber*5);
                            } else {
                                forsize = 5;
                            }
                            fromnum = thisnumber*5; 
                        } else {
                            fromnum = (thisnumber-1)*5;
                        }
                        break;
                    //尾页
                    case "pagereview last" :
                        $(".numinput").find("input").val(lastpagenum);
                        thisnumber = parseInt($(".numinput").find("input").val()); //当前页码
                        fromnum = (thisnumber-1)*5;
                        if(thisnumber === lastpagenum) {
                            forsize = parseInt(dataLength - (thisnumber - 1)*5);
                        } else {
                            forsize = 5;
                        }
                        break;
                    //跳转
                    case "pagereview location" :
                        if(thisnumber > lastpagenum) {
                            thisnumber = lastpagenum;
                            $(".numinput").find("input").val(thisnumber);
                        }
                        if(!thisnumber) {
                            thisnumber = 1;
                            $(".numinput").find("input").val(thisnumber);
                        }
                        if(thisnumber === lastpagenum) {
                            forsize = parseInt(dataLength - (thisnumber - 1)*5);
                        } else {
                            forsize = 5;
                        }
                        fromnum = (thisnumber - 1)*5;
                        break;
                }
                for (var i = 0; i < forsize; i++) {
                    liHtml = "<li><a href='" + data["news"][i + fromnum].target + "' target='blank'>" + data["news"][i + fromnum].title + "</a>"+
                            "<span class='date-annunce pull-right'>"+ data["news"][i + fromnum].date +"</span>" +   
                            "</li>";
                    newsArray.push(liHtml);
                }
                var newsHtml = newsArray.join(" ");
                $(".addnewsmodal").find(".news").append(
                    "<ul class='list-group content-ul'>" +
                    newsHtml +
                    "</ul>" 
                );
            }); 
        
//      主页最新动态列表添加
            var newsArray = [];  //li 数组
            var liHtml;  //lihtml
            var newsHtml;  //li总html
            var size = data["news"].length;
            if(size >= 5) {
                size = 5;
            }
            for (var i = 0; i< size; i++) {
            liHtml = "<li><a href='" + data["news"][i].target + "' target='blank'>" + data["news"][i].title + "</a></li>";
            newsArray.push(liHtml);
            }
            var newsHtml = newsArray.join(" ");
            $(".addnewsparent").find(".news").append(
            "<ul class='list-group content-ul'>" +
            newsHtml +
            "</ul>" 
            );
            
//        主页采购政策动态列表添加
            var newsArraypolic = [];  //li 数组
            var policliHtml;  //lihtml
            var policnewsHtml;  //li总html
            var policesize = data["policy"].length;
            for (var i = 0; i < policesize; i++) {
                policliHtml = "<li><a href='javascript:void(0);' class='showpolicy showmodala' id='" + data["policy"][i].id + "'>" + data["policy"][i].title + "</a>"+
                                "</li>";
                newsArraypolic.push(policliHtml);
            }
            var policnewsHtml = newsArraypolic.join(" ");
            $(".systemup").find(".content-ul").append(
                policnewsHtml
            );

//      最新动态窗口列表
            $(".news").on("click",".more",function() {
                $(".addnewsmodal").find(".page-nums,.content-ul").remove(); 
                //          添加分页
                srmObj.addPages(data["news"],"addpages");
                //          添加动态列表
                var newsArray = []; //li 数组
                var liHtml; //lihtml
                var newsHtml; //li总html
                var size = data["news"].length;
                    if(size >= 5) {
                        size = 5;
                    } 
                var lastpagenum = Math.ceil(data["news"].length/5); //最后一页页码
                $(".addnewsmodal").find(".totalpagenum").text(lastpagenum);
                for (var i = 0; i< size; i++) {
                liHtml = "<li><a href='" + data["news"][i].target + "' target='blank'>" + data["news"][i].title + "</a>" +
                        "<span class='date-annunce pull-right'>"+ data["news"][i].date +"</span>" +   
                        "</li>";
                        newsArray.push(liHtml);
                }
                var newsHtml = newsArray.join(" ");
                $(".addnewsmodal").find(".news").append(
                    "<ul class='list-group content-ul'>" +
                    newsHtml +
                    "</ul>" 
                );
            });
            
//      帮助和政策窗口列表添加和分页
            var addhelppolicLis = function(parentClass,childClass,removeClass,obj,linkClass) {
                $("." + parentClass).find("." + childClass).on("click",function() {
                    $("." + removeClass).find(".page-nums,.content-ul").remove(); 
                //   添加分页
                srmObj.addPages(obj,removeClass);
                //   添加动态列表
                    var newsArray = [];
                    var liHtml;
                    var newsHtml;
                    var size = obj.length;
                    if(size >= 5) {
                        size = 5;
                    } 
                    var lastpagenum = Math.ceil(obj.length/5); //最后一页页码
                    $("." + removeClass).find(".totalpagenum").text(lastpagenum);
                    for (var i = 0; i< size; i++) {
                        liHtml = "<li><a href='javascript:void(0);' class='" + linkClass + " showmodala' id='" + obj[i].id + "'>" + obj[i].title + "</a>"+
                                 "<span class='date-annunce pull-right'>"+ obj[i].date + "</span>" +   
                                 "</li>";
                        newsArray.push(liHtml);
                    }
                    var newsHtml = newsArray.join(" ");
                    $("." + removeClass).find(".pagination").before(
                        "<ul class='list-group content-ul'>" +
                        newsHtml +
                        "</ul>" 
                    );
                });
            };
//      供应商帮助添加列表和分页
            addhelppolicLis("navbar-nav","helplink","showhelpmodalpa",data['help'],"showhelpmodal");

//      采购政策添加列表和分页
            addhelppolicLis("systemup","policylink","showpolicymodal",data['policy'],"showpolicy");

//      帮助和采购政策详情
            var detailshelppolicy = function(parentClass,childClass,detailClass) {
                $("." + parentClass).on("click","." + childClass,function() {
                    var thisId= this.id;
                    var newobj = eval("data."+ thisId);
                    $("." + childClass).find("h4").text(newobj.title);
                    $("." + childClass).find(".name").text(newobj.name);
                    $("." + childClass).find(".date").text(newobj.date);
                    $("." + childClass).find(".modalbody-content").html(newobj.content);
                    var filelinkhtml; //单个附件链接
                    var filelinkhtmlArray = []; //附件链接集合
                    var finalfileshtml;  //所有链接链接
                    if(newobj.filelink) {
                        for(var i = 0;i < newobj.filelink.length;i++) {
                            filelinkhtml = "<a href='" + newobj.filelink[i] + "' target='blank'>" + newobj.filename[i] + "</a>";
                            filelinkhtmlArray.push(filelinkhtml);
                        }
                        finalfileshtml = filelinkhtmlArray.join(" ");
                        $("." + detailClass).find(".filedisplay").html(
                            finalfileshtml
                        );
                    } else {
                        $("." + detailClass).find(".filedisplay").html(
                            "无"
                        );
                    }
                });
            };

//      帮助详情窗口
            detailshelppolicy("showhelpmodalpa","showhelpmodal","showhelpmodal");

//      采购政策详情窗口
            detailshelppolicy("systemup","showpolicy","showpolicy");
            
//    点击帮助和政策的分页点击事件
            var clickhelppolicpages = function (parentClass,removeClass,obj,linkClass) {
                $("." + parentClass).on("click",".pagereview",function() {
                    $(this).parents("." + removeClass).find(".content-ul").remove();
                    var thisClass = $(this).attr("class");
                    var thisnumber = parseInt($(this).siblings(".numinput").find("input").val()); //当前页码
                    if(isNaN(thisnumber)) {
                        thisnumber = 1;
                        $(".numinput").find("input").val(1);
                    }
                    var dataLength = parseInt(obj.length); //所有数据条数
                    var lastpagenum = Math.ceil(dataLength/5); //最后一页页码
                    var forsize ; //循环条数
                    var fromnum; //起始的条数num
                    var liHtml;
                    var newsArray = [];
                    if(thisnumber === lastpagenum ) {
                        forsize = parseInt(dataLength - (thisnumber - 1)*5);
                    } else {
                        forsize = 5;
                    }
                    switch(thisClass) {
                        //首页
                        case "pagereview first" :
                            $(".numinput").find("input").val(1);
                            thisnumber = parseInt($(".numinput").find("input").val()); //当前页码
                            if(thisnumber === lastpagenum) {
                                forsize = parseInt(dataLength - (thisnumber - 1)*5);
                            } else {
                                forsize = 5;
                            }
                            fromnum = 0;
                            break;
                        //上一页
                        case "pagereview previous" :
                            if(thisnumber !==1) {
                                if(thisnumber > lastpagenum) {
                                    thisnumber = 2;
                                }
                                $(".numinput").find("input").val(thisnumber - 1);
                                thisnumber = parseInt($(".numinput").find("input").val()); //当前页码
                                fromnum = (thisnumber+1)*5 - 10;
                                if(thisnumber === lastpagenum) {
                                    forsize = parseInt(dataLength - thisnumber*5);
                                } else {
                                    forsize = 5;
                                }
                            } else {
                                fromnum = 0;
                            }
                            break;
                        //下一页
                        case "pagereview next" :
                            if(thisnumber !== lastpagenum) {
                                if(thisnumber > lastpagenum) {
                                    thisnumber = lastpagenum -1;
                                }
                                $(".numinput").find("input").val(thisnumber + 1);
                                if(thisnumber + 1 === lastpagenum) {
                                    forsize = parseInt(dataLength - thisnumber*5);
                                } else {
                                    forsize = 5;
                                }
                                fromnum = thisnumber*5; 
                            } else {
                                fromnum = (thisnumber-1)*5;
                            }
                            break;
                        //尾页
                        case "pagereview last" :
                            $(".numinput").find("input").val(lastpagenum);
                            thisnumber = parseInt($(".numinput").find("input").val()); //当前页码
                            fromnum = (thisnumber-1)*5;
                            if(thisnumber === lastpagenum) {
                                forsize = parseInt(dataLength - (thisnumber - 1)*5);
                            } else {
                                forsize = 5;
                            }
                            break;
                        //跳转
                        case "pagereview location" :
                            if(thisnumber > lastpagenum) {
                                thisnumber = lastpagenum;
                                $(".numinput").find("input").val(thisnumber);
                            } 
                            if(!thisnumber) {
                                thisnumber = 1;
                                $(".numinput").find("input").val(thisnumber);
                            }
                            if(thisnumber === lastpagenum) {
                                forsize = parseInt(dataLength - (thisnumber - 1)*5);
                            } else {
                                forsize = 5;
                            }
                            fromnum = (thisnumber - 1)*5;
                            break;
                    }
                    for (var i = 0; i < forsize; i++) {
                        liHtml = "<li><a href='javascript:void(0);' class='" + linkClass + " showmodala' id='" + obj[i + fromnum].id + " '>" + obj[i + fromnum].title + "</a>"+
                                "<span class='date-annunce pull-right'>"+ obj[i + fromnum].date + "</span>" +   
                                "</li>";
                        newsArray.push(liHtml);
                    }
                    var newsHtml = newsArray.join(" ");
                    $("." + parentClass).find(".pagination").before(
                        "<ul class='list-group content-ul'>" +
                        newsHtml +
                        "</ul>" 
                    );
                });
            };

//    帮助窗口分页点击事件
            clickhelppolicpages("showhelpmodalpa","showhelpmodalpa",data["help"],"showhelpmodal");
            
//    采购政策分页点击事件
            clickhelppolicpages("showpolicy","showpolicymodal",data["policy"],"showpolicymodal");

//    页面加载显示底部最新动态
            $(".bottomnews").animate({bottom:"0"},1500);
            $(".bottomnews").find(".close").on("click",function() {
                $(this).parents(".bottomnews").hide();
            });
            
            //底部弹窗数据显示
            $(".bottomnews").find("a").before("<h6>"+ data["bottomnews"][0].title +"</h6>");
            $(".bottomnews").find("a").attr("href",data["bottomnews"][0].link);
            $(".bottomnews").find("a").text(data["bottomnews"][0].content);
        }
    });
    
//    投诉与反馈按钮点击事件
    $(".compaintmodal2").on("click",".comfeedradio",function() {
       var thisClass = $(this).attr("class").split(" ")[1];
       $(this).prop("checked","true");
       switch(thisClass) {
            case "comradio" :
                $(this).parents(".Complaint-table").find("select").html(
                    "<option>违反公平公正原则</option>" +
                    "<option>收受财物</option>" +
                    "<option>损害比亚迪公司利益</option>" +
                    "<option>其他</option>"  
                );
                break;
            case "feedradio" :
                $(this).parents(".Complaint-table").find("select").html(
                    "<option>个人反馈</option>" +
                    "<option>流程反馈</option>" 
                );
                break;
        }    
    });
    
    
    //日期控件
    srmObj.dareselect = function() {
        $('.datetimepicker').datetimepicker({
            minView: "month", //选择日期后，不会再跳转去选择时分秒 
            language:  'zh-CN',
            format: 'yyyy-mm-dd',
            todayBtn:  1,
            autoclose: 1
        });
    };
   
//前台附件展示
    srmObj.addfilesshow = function(parentsClass,childClass,url,type,addfileparent) {
        $(parentsClass).on("click","." + childClass,function() {
            var thisClass = $(this).attr("class").split(" ")[0];
            var thisId = thisClass.split("_")[1];
            var newjson = {};
            var aListsArray = []; //a链接集合
            var aHtml; //a链接 html
            var finalAhtml;
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'POST',
                data: $.param({header_id:thisId,filetype:type}),
                success: function(data) {
                    for(key in data) {
                        newjson[thisId] = data["srmattslist"];
                    }
                    for(var i = 0;i < newjson[thisId].length;i++) {
                        aHtml = "<a href='../SrmHome/Download.jsp?__METHOD=Download&fileId="+ newjson[thisId][i].id + "' target='_blank'>" + newjson[thisId][i].realfilename +"</a>";
                        aListsArray.push(aHtml);
                    }
                    finalAhtml = aListsArray.join(" ");
                    $("." + addfileparent).find(".filedisplay").html(finalAhtml);
                },
                error: function() {
                    $("." + addfileparent).find(".filedisplay").html("无");
                }
            });
        });
    };
    
    //验证失败错误信息提示关闭
    $(".wrap").on("click",".closevalidate",function() {
        $(this).parents(".validate").remove();
        if($("body").find(".modalvisble").length === 0) {
            $(".wrap").find(".mask").remove();
        }
        $(".mask").css({"z-index":"1030"});
    });
    
//    验证电话号码
    srmObj.telnumsvalidate = function(tel) {
        var mobile = /^1[3|5|8][7][4]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
        return mobile.test(tel) || phone.test(tel);
    };