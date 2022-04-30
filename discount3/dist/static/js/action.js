$(document).ready(function () {
    



    BindProjectList();
    

})
$(function () {


    BindNews();
  
    $(".querycon3_btn").click(function () {

        SearchUser("1");
    });

    //$("#postDataAction").click(function () {

       // PostData();
    // });


    BindSilder();

    
   
});

var obj = null;
function BindProjectList()
{
    $.get("active/", function (data) {


        $("#plist").html("");
        $(".links").html("");
         // obj = eval('(' + data + ')');
        obj = data
        var pstr = "";


        var links = "";
      
        for (var k = 0; k < obj.length; k++) {
               

            /* <div class="links_a" onclick="show(2)"><img src="images/img1.png"></div>*/



            if (obj[k].T_ProClassName.indexOf("http") > -1) {
                // links += "<a   class=\"querycon2_btn\" target=\"_blank\"  href=\"" + obj[k].T_ProClassName + "\"><img src=\"" + obj[k].ClassRemark.replace("../", "") + "\"></a>";

//                links += "<div class=\"links_a\" onclick=\"window.open('" + obj[k].T_ProClassName + "')\"><img src=\"" + obj[k].ClassRemark.replace("../", "") + "\"></div>";

                links += "<div class=\"links_a\"><img src=\"" + obj[k].ClassRemark + "\"><h3>" + obj[k].T_ProClassName + "</h3><p class=\"btn\"><a class=\"querycon2_btn\" target=\"_blank\"  href=\"" + obj[k].T_ProClassName + ">点击申请</a></p></div>";

            }
            else {
                //links += "<a   class=\"querycon2_btn\" href=\"javascript:ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');\"><img src=\"" + obj[k].ClassRemark.replace("../", "") + "\"></a>";

                links += "<div class=\"links_a\" ><img src=\"" + obj[k].ClassRemark + "\"><h3>" + obj[k].T_ProClassName + "</h3><p class=\"btn\"><a class=\"querycon2_btn\" href=\"javascript:ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');ShowDiv();\">点击申请</a></p></div>";

//                links += "<div class=\"links_a\" onclick=\"ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');ShowDiv();\"><img src=\"" + obj[k].ClassRemark.replace("../", "") + "\"></div>";
            }
        }

  
        $(".links").html(links);
        for (var z = 0; z < obj.length; z++)
        {

            if (!(obj[z].T_ProClassName.indexOf("http://") > -1))
                pstr += "<option value=\"" + obj[z].T_ProClassID + "\">" + obj[z].T_ProClassName + "</option>";
        }

        $("#plist").html(pstr);
    });
}

    function SearchUser(Pindex) {
      if ($("#s_user").val() != "") {
        $("#serch_resule").html("");
        $.get("/api/records/?ordering=-id&account=" + $("#s_user").val() + "&actid=" + $("#plist").val() + "&page_size=5&page=" + Pindex + "&_=" + Number(new Date()), function (data) {
          if (data.count === 0) {
            alert("未查到任何信息！");
          } else {
            var r_s = "<tr><th  width=\"25%\" >会员账号</th><th width=\"25%\">申请时间</th><th  width=\"25%\">申请状态</th><th>查看回复</th></tr>";
            var bq = data.results
            var PageList = Math.ceil(data.count / 5)
            var p_str = "";
            var State = "";
            for (var z = 0; z < bq.length; z++) {
              //T_ProductNote
              r_s += "<tr><td width=\"25%\"style=\"color:#fff\">" + bq[z].account + "</td>";
              r_s += "<td width=\"25%\"style=\"color:#fff\">" + bq[z].apply_time.slice(0, -7).replace("T", " ") + "</td>";
              if (bq[z].status === 3) State = "已派发";
              else if (bq[z].status === 4) State = "不符合";
              else State = "审核中";
              r_s += "<td width=\"25%\" class=\"" + (bq[z].status === 3 ? "green" : "red") + "\">" + State + "</td>";
              r_s += "<td><a href=\"#\">点击查看 <p class=\"tip\"><span>" + (bq[z].message == null ? "管理员正在审核中" : bq[z].message) + "</span></p></a></td></tr>";
            }
            $("#serch_resule").html(r_s);

            for (var p = 1; p <= parseInt(PageList); p++) {
              if (p === Pindex)
                p_str += "<span>" + p + "</span>";
              else
                p_str += "<a href=\"javascript:SearchUser(" + p + ")\" class=\"NoPage\">" + p + "</a>";
            }
            $(".page").html(p_str);
            show(3)
          }
        });
      }
      else {
        alert("请输入查询帐号");
      }
    }

function ShowDivPanel(Title,k,eInfo,p_id,Is_Xz)
{
   
    $(".con4").html(obj[k].T_ProClassKey);
    $("#TitleName").html(Title);
    $("#postcontent").html("");

    var str= "";

    str += "<p class=\"row\"><span>申请主题：</span><font color=\"#FDE717\" id=\"Titlestr\">" + Title + "</font>&nbsp;&nbsp;<a class=\"d_btn\" href=\"javascript:DetailPanel()\">查看详情</a></p>";
    str += " <p class=\"row\"><span>会员账号：</span><input type=\"text\" value=\"\" id=\"UserID\" placeholder=\"输入会员帐号\"></p>";

    var _kj = eInfo.split(',');
    for (var i = 0; i < _kj.length - 1; i++)
    {
        if (_kj[i].split('|')[1] == "1")
        {
            str += "<p class=\"row\"><span>" + _kj[i].split('|')[0] + "：</span><input type=\"text\" value=\"\" placeholder=\"" + _kj[i].split('|')[0] + "\"></p>";
        }
        if (_kj[i].split('|')[1] == "0")
        {
           // str += "<p id='fp2' class=\"row uploader white\"><input type=\"text\" class=\"filename\" id=\"fp1\" style=\"width:200px;\"  /><input type=\"button\" name=\"file\" class=\"button\" value=\"浏览选择图片\" /><input type=\"file\" id=\"FileC\" name=\"FileC\" size=\"30\" /></p>";
         
            str += "<p class=\"row\" style=\"padding-top:10px;\" id='fp3' ><span id='filetitle'>" + _kj[i].split('|')[0] + "：</span><p id='fp2'  style=\"background: #fff; display: inline-block; margin-left: 1px; border-radius: 3px;\">";

            str += "<input type='text' id='fp1' style=\"width:187px;\" disabled />";

            str += "<a id=\"textfieldbtn_a\" onclick=\"document.getElementById('FileC').click();\" href=\"javascript:;\">浏览图片</a>";

            str += "<input type=\"file\" size=\"28\"  id=\"FileC\" name=\"FileC\" onchange=\"document.getElementById('fp1').value=this.value\" style=\"display:none\"/> ";
            str += "</p>";
            str += "</p>";
            //<p class="row"><span>上传截图文件：</span>
            //<p style=" background: #fff; display: inline-block; margin-left: 3px; border-radius: 3px;">	
              //  <input type='text' id='textfield' style="width:185px;" disabled/>
                //<a id="textfieldbtn_a" onclick="document.getElementById('textfieldbtn').click();" href="javascript:;">浏览图片</a>
               // <input type="file" size="28" id="textfieldbtn" onchange="document.getElementById('textfield').value=this.value" style="display:none"/> 
           // </p>
       // </p>


           // str += "<p class=\"row\" id='fp'><a class=\"file\" href=\"javascript:$('#UploadFile').css('display','')\">点击上传图片</a></p>";
        }
       
    }

    str += "  <p class=\"row\"  id='fp'><span>验证码：</span><input type=\"text\" id=\"EnCode\" value=\"\" placeholder=\"填写验证码\"><span class=\"rmNum\" id='YZMCODE'  title=\"点击切换验证码\"onclick=\"$(this).html(createCode())\">" + createCode() + "<span></p>";
  

    str += "<p class=\"row\" style=\"margin-left:165px;\"><input type=\"submit\" value=\"\" class=\"subbtn subbtn0\"  onclick=\"PostData('" + p_id + "','" + eInfo + "','" + Is_Xz + "')\" ><input type=\"submit\" value=\"\" onclick=\"show(1);$('#querycon2').css('display','none')\" class=\"subbtn subbtn1 ml10\"></p>";

    $("#postcontent").html(str);
    show(2);

    SetUpload();
}

function DetailPanel()
{
    show(4);
}

function PostData(ProjectID, eInfo,Is_Xz)
{

    var IsIpload = false;
    var _kj = eInfo.split(',');
    for (var i = 0; i < _kj.length - 1; i++) {
        if (_kj[i].split('|')[1] == "1") {

        }
        if (_kj[i].split('|')[1] == "0") {
            IsIpload = true;
        }

    }


    var val_list = $("#postcontent").find("p");
    var Info = "";

    for (var i = 1; i < val_list.length-2; i++) {



        
        if ($(val_list[i]).attr("id") != "fp" && $(val_list[i]).attr("id") != "fp2" && $(val_list[i]).attr("id") != "fp3") {


            if ($(val_list[i]).html() != "") {
                if ($($(val_list[i]).find("input[type='text']")[0]).val() != "") {

                    Info += $($(val_list[i]).find("span")[0]).html()+ $($(val_list[i]).find("input[type='text']")[0]).val() + "|";
                }
                else {
                    alert("信息不能为空");
                    break;
                    return false;
                }
            }
        }

    }

 

    if (IsIpload) {
        if ($("#FileC").val() == "") {

            alert("请上传附件");
            return false;
        }

    }

    if ($("#UserID").val() == "") {

        alert("账号不能为空");
        return false;
    }

    //  $(".ckfile").html("").css("color", "#535353");

    //$("#_userImgPath").val("");
    if (IsIpload) {
        var str = $("#FileC").val();

        if ($.trim(str) == "") {

            //$(".ckfile").html("请选择文件。").css("color", "red");
            alert("请选择文件");
            return false;

        }

        else {

            var postfix = str.substring(str.lastIndexOf(".") + 1).toUpperCase();

            if (postfix == "JPG" || postfix == "JPEG" || postfix == "PNG" || postfix == "GIF" || postfix == "BMP") {



                var path = "Upload/UserImg";

                $.ajaxFileUpload({

                    url: 'UploadFile.aspx?path=Upload|UserImg&shape=100^100',

                    secureuri: false,

                    fileElementId: 'FileC',

                    dataType: 'text',

                    success: function (msg) {

                    
                        if (msg != "")
                            Info += $("#filetitle").text() + "◆" + msg;




                        if ($("#YZMCODE").text().toLocaleLowerCase() == $("#EnCode").val().toLocaleLowerCase()) {


                            $.post("GetProjectList.aspx", { "id": "p", "PostInfo": Info, "pid": ProjectID, "UserNo": $("#UserID").val(), "Xz": Is_Xz }, function (data) {

                                if (data == "ok") {
                                  
                                    $.post("Send.aspx", { "Content": $("#UserID").val()+"^"+$("#Titlestr").text() }, function (data33) {



                                        alert("提交成功,请等待后台申请");
                                        $("#querycon2").css("display", "none");
                                    });

                                    
                                }
                                else if (isNaN(data))
                                {
                                    alert(data);
                                }
                                else
                                    alert(Almg[parseInt(data)]);
                            });
                        }

                        else {
                            alert("验证码错误");

                        }

                    }

                });

            } else {

                alert("格式错误");
                return false;

            }

        }
    }
    else
    {
        if ($("#YZMCODE").text().toLocaleLowerCase() == $("#EnCode").val().toLocaleLowerCase()) {


            $.post("active/", {"PostInfo": Info, "pid": ProjectID, "UserNo": $("#UserID").val(), "Xz": Is_Xz }, function (data) {

                if (data == "ok") {
                        alert("提交成功,请等待后台申请");
                        $("#querycon2").css("display", "none");
                }

                else if (isNaN(data)) {
                    alert(data);
                }
                else
                    alert(data.error);
            });
        }

        else {
            alert("验证码错误");

        }
    }







    

}

function createCode() {
   var code = "";
    var codeLength = 4;//验证码的长度  

    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数  
    for (var i = 0; i < codeLength; i++) {//循环操作  
        var index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）  
        code += random[index];//根据索引取得随机数加到code上  
    }
  
  

    return code;
}

function BindNews()
{
    $.get("resource/recs", function (data) {

        $(".notice_list").html("0");
        var _ulstr = "<ul> ";
         var ob=data;
        var oblen=ob.length>50?50:ob.length;      
        for (var x = 0; x < oblen; x++) 
        {
            var n = ob[x].T_ProductName;
            //"".substring(3, 1);
            _ulstr += "<li>恭喜：<span class=\"span1\">" + ob[x].T_ProductName.substring(0, ob[x].T_ProductName.length - 3) + "***" + "</span>&nbsp;成功办理&nbsp;<span  class=\"span2\">" + ob[x].T_ProClassName + "</span></li>";

        }
        _ulstr+="</ul>"
        //<ul>  <li>恭喜：<span>zhe*** </span>成功办理<span>“游”惠xcxcxcxxcxc-老虎机注单彩金</span></li>
        $(".notice_list").html(_ulstr);
        $('.notice_list li:even').addClass('lieven');
        $(".notice_list").myScroll({


            speed: 60,
            rowHeight: 28,
        });
    });
}

function BindSilder()
{
    $.get("resource/sliders", function (data) {

        
        var sx = data;
        var str = "<ul class=\"slides\">";
        $("#slids").html("");

        for (var z = 0; z < sx.length; z++)
        {
            str += "<li ><a href=" + sx[z].url + "   target=\"_blank\"><img src=" + sx[z].img + "></a></li>";
            // if (sx[z].split('|')[1]!="")
            //     str += "<li ><a href=" + sx[z].split('|')[1] + "   target=\"_blank\"><img src=" + sx[z].split('|')[0] + "></a></li>";
        }

        str += "</ul>";

        $("#slids").html(str);


        $('.flexslider1').flexslider({
            animation: "slide",
        });
    });
}

function SetUpload()
{
    $("input[type=file]").change(function () { $(this).parents(".uploader").find(".filename").val($(this).val()); });
    $("input[type=file]").each(function () {
        if ($(this).val() == "") { $(this).parents(".uploader").find(".filename").val(""); }
    });
}


function ShowDiv()
{
    $('#querycon2').show().siblings('.modal').hide();
    $('#querycon2').addClass('show1');
    $('#querycon2 .modal_wrap').addClass('show1');
}


var Almg = ["无需在线申请,系统统一派送",
             "不是申请时间,详细请点击“查看详细”",
             "不是申请时间,详细请点击“查看详细”",
             "此单号已申请优惠，不可重复提交！",
             "您的申请正在审核中，请勿重复提交.....",
             "提交失败,请联系客服人员", "该IP已申请,请勿重复提交", "提交失败,请联系客服人员","提交异常"];

