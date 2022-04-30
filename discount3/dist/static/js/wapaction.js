
$(function () {

    BindProjectList();
    //BindNews();
  
    $(".search").click(function () {

        SearchUser("1");
    });

    CheckUseIsLogin();

    time();
    $("#mcode").val(RanDomList());



    BindNews();
    //BindSilder();
});

function RanDomList() {

    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }

    return Num;

}


var obj = null;
function BindProjectList()
{
    $.post("GetProjectList.aspx", { "id": "l" }, function (data) {


       

        $("#plist").html("");
        $(".list").html("");
         obj = eval('(' + data + ')');
        
        var pstr = "";


        var links = "";
      
       
      
        for (var k = 0; k < obj.length; k++) {


            /*<tr>
                 <td><a href="">电子消除彩金</a></td>
                 <td><a href="">电子组队彩金</a></td>
             </tr>*/


            var _param = "?Title=" + encodeURI(obj[k].T_ProClassName) + "&k=" + k + "&eInfo=" + encodeURI(obj[k].InfoList) + "&p_id=" + obj[k].T_ProClassID + "&IsXz=" + obj[k].IsXz;


            if (k % 2 == 0) {

                if (obj[k].T_ProClassName.indexOf("http://") > -1)
                    links += "<tr><td width=\"50%\"><a target=\"_blank\" href=\"" + obj[k].T_ProClassName + "\"></a></td>";
                else
                    links += "<tr><td  width=\"50%\"><a href=\"apply.html" + _param + "\" >" + obj[k].T_ProClassName + "</a></td>";
            }
            else {

                if (obj[k].T_ProClassName.indexOf("http://") > -1)
                    links += "<td width=\"50%\" ><a target=\"_blank\" href=\"" + obj[k].T_ProClassName + "\"></a></td></tr>";
                else
                    links += "<td  width=\"50%\"><a  href=\"apply.html" + _param + "\"  >" + obj[k].T_ProClassName + "</a></td></tr>";
            }



            /* if (obj[k].T_ProClassName.indexOf("http://") > -1) {
                links += "<li onclick=\"window.open('" + obj[k].T_ProClassName + "');\"><img src=\"" + obj[k].ClassRemark.replace("../", "") + "\" width=\"720\" height=\"190\" \"><div class=\"cl\"><h4>&nbsp;</h4><a class=\"fr\" target=\"_blank\" href=\"" + obj[k].T_ProClassName + "\"><img src=\"wapstyle/images/btn2.png\"></a></div></li>";
               links += "<img src=\"" + obj[k].ClassRemark.replace("../", "")+ "\">";
                links += "<span><a class=\"querycon2_btn\" href=\"" + obj[k].T_ProClassName + "\">立即申请</a>";
                links += "<a class=\"querycon4_btn\" target=\"_blank\" href=\"" + obj[k].T_ProClassName + "\">查看详情</a></span>";
                links += "<p></p></div>";
             }
            else {
               links += "<div class=\"link\">";
                links += "<img src=\"" + obj[k].ClassRemark.replace("../", "") + "\">";
                links += "<span><a class=\"querycon2_btn\" href=\"javascript:;ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');\">立即申请</a>";
                links += "<a class=\"querycon4_btn\" href=\"javascript:SetDetial('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');\">查看详情</a></span>";
                links += "<p>" + obj[k].T_ProClassName + "</p></div>";

                links += "<li  onclick=\"ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');\"><img src=\"" + obj[k].ClassRemark.replace("../", "") + "\" width=\"720\" height=\"190\" \"><div class=\"cl\"><h4>" + obj[k].T_ProClassName + "</h4><a class=\"fr\" target=\"_blank\" href=\"javascript:ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');\"><img src=\"wapstyle/images/btn2.png\"></a></div></li>";


               // links += "<a   class=\"querycon2_btn\" href=\"javascript:ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');\"><img src=\"" + obj[k].ClassRemark + "\"><span><img src=\"images/link_btn.png\"  onclick=\"ShowDivPanel('" + obj[k].T_ProClassName + "','" + k + "','" + obj[k].InfoList + "','" + obj[k].T_ProClassID + "','" + obj[k].IsXz + "');\"></span><p>" + obj[k].T_ProClassName + "</p></a>";
        }*/
        }

        $(".table").html(links);



/*
        for (var z = 0; z < obj.length; z++)
        {

            if (!(obj[z].T_ProClassName.indexOf("http://") > -1))
                pstr += "<option value=\"" + obj[z].T_ProClassID + "\">" + obj[z].T_ProClassName + "</option>";
        }

        $("#plist").html(pstr);

        */
       
    });
}
var px = 0;
function SearchUser(Pindex)
{
   
    if ($("#useid").val() != "") {

        $("#serch_resule").html("");
        $.post("GetProjectList.aspx", { "id": "s", "UserID": $("#UserTxt").val(), "cid": $("#plist").val(), "p": Pindex }, function (data) {

        
            
           
            var r_s = "<div class=\"row\"><p style=\"font-size:30px; color:#f00;\">会员账号：" + $("#UserTxt").val() + "</p></div>";
            if (data.split('▲')[0] == "[]") {          
                alert("未查到任何信息！");
            }
            else
            {

                
 
                var bq = eval('(' + data.split('▲')[0] + ')');
                var PageList = data.split('▲')[1];
                var p_str = "";
               

             
                var State="";
               
               
                for (var z = 0; z < bq.length; z++)
                {

                    if (bq[z].T_ProductNote == "2")
                        State = "不符合";
                    if (bq[z].T_ProductNote == "3" || bq[z].T_ProductNote == "4")
                        State = "已派发";

                    if (bq[z].T_ProductNote == "1")
                        State = "审核中";



                 

                    r_s += "<div class=\"row\"><div class=\"text\">";
                    r_s += "<p>申请日期：" + bq[z].T_DateTime.replace("T", " ") + "</p>";
                    r_s += "<p>审核结果：<span class=\"green\">" + State + "</span></p>";
                    r_s += "<p>" + (bq[z].Remark == null ? "管理员正在审核中" : bq[z].Remark) + "</p>";
                    r_s+="</div>";
                    r_s+="</div>";
                    
                        
                        
                        
                    
                



                    //T_ProductNote
                  /*  r_s += "<tr><td width=\"25%\">" + bq[z].T_ProductName + "</td>";
                    r_s += "<td width=\"25%\">" + bq[z].T_DateTime.replace("T", " ") + "</td>";

                   

                    r_s += "<td width=\"25%\" class=\"" + (State == "已派发" ? "green" : "red") + "\">" + State + "</td>";
                    r_s += "<td><a href=\"#\">点击查看 <p class=\"tip\"><span>" + (bq[z].Remark == null ? "管理员正在审核中" : bq[z].Remark) + "</span></p></a></td></tr>";*/
                }


                if (bq.length >= 8)
                {
              
                    r_s += "<div class=\"row\"><input type=\"button\" value=\"点击查看更多\" class=\"subbtn search\" id='morebtn' style=\"background:#D3D3D3; color:#868686;\"></div>"
                }
            

                $("#serch_resule").html(r_s);

               /* for (var p = 1; p <= parseInt(PageList) ; p++) {
                    if (p == Pindex)
                        p_str += "<span>" + p + "</span>";
                    else
                        p_str += "<a href=\"javascript:SearchUser(" + p + ")\" class=\"NoPage\">" + p + "</a>";
                }


                $(".page").html(p_str);*/

                //modal5
                $("#modal4").hide();
                showmodal(5);
            }
            

          

        });
    }
    else
    {
        alert("请先绑定帐号");
    }
}

function morebtn()
{
    SearchUser(px++);
}

function SetDetial(Title, k, eInfo, p_id, Is_Xz)
{
    $(".con4").html(obj[k].T_ProClassKey);
    $("#TitleName").html(obj[k].T_ProClassName);
    DetailPanel();
}

function ShowDivPanel(Title,k,eInfo,p_id,Is_Xz)
{
   
    $(".con4").html(obj[k].T_ProClassKey);
    $("#TitleName").html(Title);
    $("#postcontent").html("");

    var str= "";
   

    //<div class="row"><p style="font-size:30px; color:#f00;">电子游艺-八重奏亏损救援彩金</p></div>

    str += "<div class=\"row\"><p style=\"font-size:30px; color:#f00;\" id='Titlestr'>" + Title + "</p></div>";
    str += "<div class=\"row\"><span style=\"display:none;\">帐号</span><input type=\"text\" id='UserID' disable value=\"" + $("#useid").val() + "\" placeholder=\"账号\"></div>";

 
    var _kj = eInfo.split(',');
    for (var i = 0; i < _kj.length - 1; i++)
    {
        if (_kj[i].split('|')[1] == "1")
        {
            //str += "<p class=\"row\"><span    class=\"fl\">" + _kj[i].split('|')[0] + "：</span><input type=\"text\" value=\"\" placeholder=\"" + _kj[i].split('|')[0] + "\"></p>";

           
            str += "<div class=\"row\"><span style=\"display:none;\">" + _kj[i].split('|')[0] + "</span><input type=\"text\" value=\"\" placeholder=\"" + _kj[i].split('|')[0] + "\" /></div>";
        }
        if (_kj[i].split('|')[1] == "0")
        {
           // str += "<p id='fp2' class=\"row uploader white\"><input type=\"text\" class=\"filename\" id=\"fp1\" style=\"width:200px;\"  /><input type=\"button\" name=\"file\" class=\"button\" value=\"浏览选择图片\" /><input type=\"file\" id=\"FileC\" name=\"FileC\" size=\"30\" /></p>";
         
           // str += "<div class=\"row cl\" id='fp3' ><span id='filetitle'  class=\"fl\">" + _kj[i].split('|')[0] + "：</span>";
           // str += "<p id='fp2'   style=\"overflow:hidden;\" class=\"fl\" ><input type='text' id='fp1' style=\"width:130px;\" disabled />";
           // str += "<a id=\"textfieldbtn_a\" onclick=\"document.getElementById('FileC').click();\" href=\"javascript:void(0);\">浏览图片</a><input type=\"file\" size=\"28\"  id=\"FileC\"  name=\"FileC\"  class=\"ui-input-file\" onchange=\"document.getElementById('fp1').value=this.value\"/>";
           // str += "</p>";
           // str += "</div>";
        }

        if (_kj[i].split('|')[1] == "2") {
            str += "<div class=\"row\"><span style=\"display:none;\">" + _kj[i].split('|')[0] + "</span><input type=\"text\" value=\"\" id='mobile' style=\"width:400px;\"  placeholder=\"手机号码\"><a id=\"GetCodebtn\" onclick=\"SendMessage()\" href=\"javascript:void(0);\">获取验证码</a></div>";
            str += "<div class=\"row\"  id='fp4' ><input type=\"text\" id='mgs' value=\"\" placeholder=\"短信验证码\"></div>";
        }

       
    }

    str += "<div class=\"row\" id='fp' ><input type=\"text\" id=\"EnCode\" style=\"width:400px;\"  value=\"\" placeholder=\"填写验证码\"><div class=\"rmNum\" id='YZMCODE'  title=\"点击切换验证码\"onclick=\"$(this).html(createCode())\">" + createCode() + "</div></div>";
  
    str += "<div class=\"row\"><input type=\"submit\" value=\"立即提交\" class=\"subbtn\"  onclick=\"PostData('" + p_id + "','" + eInfo + "','" + Is_Xz + "')\" ></div>";

   
    
    $('#postcontent').html(str);

    //showmodal(3);
	
	$("#modal3").show();
}

function SendMessage()
{


    var val_list = $("#postcontent").find("p");

    var Info = "";
    var IsAction = true;
    for (var i = 1; i < val_list.length - 2; i++) {


        if ($(val_list[i]).attr("id") == "fp4")
            IsMessage = true;

        if ($(val_list[i]).attr("id") != "fp" && $(val_list[i]).attr("id") != "fp2" && $(val_list[i]).attr("id") != "fp3" && $(val_list[i]).attr("id") != "fp4") {




            if ($(val_list[i]).html() != "") {
                if ($($(val_list[i]).find("input[type='text']")[0]).val() != "") {

                    Info += $($(val_list[i]).find("span")[0]).html() + "◆" + $($(val_list[i]).find("input[type='text']")[0]).val() + "^";
                }
                else {
                    //alert("信息不能为空");

                    IsAction = false;
                    break;
                }
            }
        }

    }
    if (IsAction) {
        if ($("#mobile").val() != "") {



            if (!(/^1[3|4|5|7|8]\d{9}$/.test($("#mobile").val()))) { alert("手机号码格式错误"); return false; }



            $.post("GetProjectList.aspx", { "id": "e", "m": $("#mobile").val() }, function (data) {

                if (data != "") {
                    if (data.split('^')[1] == "提交成功") {


                        $("#mcode").val(data.split('^')[0]);
                        alert("发送成功,已发送至手机请查收");
                    }
                    else {
                        alert("发送失败");
                    }
                }
                else {
                    alert("发送失败");
                }
            });

            Secons = 120;

            Seconobj = window.setInterval(DjSc, 1000);
        }
        else {
            alert("请输入手机号码");
        }
    }
    else
    {
        alert("资料完善后才可进行短信验证");
    }
}
var Secons = 0;
var Seconobj = null;

function DjSc() {
    Secons--;
    var link = document.getElementById("GetCodebtn");
    if (Secons > 0) {
        $("#GetCodebtn").html("还剩" + Secons + "秒");
        $("#GetCodebtn").attr("onclick", "return false");
        $("#GetCodebtn").css("color", "#999999");
    }
    else {
        $("#GetCodebtn").html("获取验证码");
        link.setAttribute("disabled", false);
        $("#GetCodebtn").attr("onclick", "SendMessage()");
        $("#GetCodebtn").css("color", "black");
        window.clearTimeout(Seconobj);

        $("#mcode").val("");
    }

}


function DetailPanel()
{
    $("#bakc").show();
    $("#querycon4").css("display", "");
}

function PostData(ProjectID, eInfo,Is_Xz)
{

    var IsIpload = false;
    var IsMessage = false;
    var IsAction = true;
    var _kj = eInfo.split(',');
    for (var i = 0; i < _kj.length - 1; i++) {
        if (_kj[i].split('|')[1] == "1") {

        }
        if (_kj[i].split('|')[1] == "0") {
            //IsIpload = true;
        }

    }

    
    var val_list = $("#postcontent").find("div[class=row]");

    
    var Info = "";

    for (var i = 1; i < val_list.length-2; i++) {



        if ($(val_list[i]).attr("id")=="fp4")
            IsMessage=true;
        
        if ($(val_list[i]).attr("id") != "fp" && $(val_list[i]).attr("id") != "fp2" && $(val_list[i]).attr("id") != "fp3" && $(val_list[i]).attr("id") != "fp4") {


            if ($(val_list[i]).html() != "") {
                if ($($(val_list[i]).find("input[type='text']")[0]).val() != "") {

                    Info += $($(val_list[i]).find("span")[0]).html() + "◆" + $($(val_list[i]).find("input[type='text']")[0]).val() + "^";
                }
                else {
                    alert("信息不能为空");
                    IsAction = false;
                    break;
                    
                }
            }
        }

    }

 

    if (IsIpload) {
        if ($("#FileC").val() == "") {

            alert("请上传附件");
            IsAction = false;
        }

    }

    if ($("#UserID").val() == "") {

        alert("账号不能为空");
        IsAction = false;
    }

    if (IsMessage) {
        if ($("#mgs").val() != $("#mcode").val()) {

            alert("短信验证码错误");
            IsAction = false;
        }
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

 var reg=/[#\$%<>&\*]+/g;

            if (reg.test($("#UserID").val())||reg.test(Info)) {

                alert("非法字符,不允许提交");

                return false;
            }

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



                        if (IsAction) {
                            if ($("#YZMCODE").text().toLocaleLowerCase() == $("#EnCode").val().toLocaleLowerCase()) {


                                $.post("GetProjectList.aspx", { "id": "p", "PostInfo": Info, "pid": ProjectID, "UserNo": $("#UserTxt").val(), "Xz": Is_Xz }, function (data) {

                                    if (data == "ok") {

                                        $.post("Send.aspx", { "Content": $("#UserID").val() + "^" + $("#Titlestr").html() }, function (data33) {



                                            alert("提交成功,请等待后台申请");
                                            $("#querycon2").css("display", "none");
                                            $("#bakc").css('display', 'none');
                                        });


                                    }
                                    else
                                        alert(data);
                                });
                            }

                            else {
                                alert("验证码错误");

                            }
                        }
                        else {
                            alert("资料不完整");
                        }

                    },
                    error: function (data, status, e) {
                       
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

 var reg=/[#\$%<>&\*]+/g;

            if (reg.test($("#UserID").val())||reg.test(Info)) {

                alert("非法字符,不允许提交");

                return false;
            }
        if (IsAction) {
            if ($("#YZMCODE").text().toLocaleLowerCase() == $("#EnCode").val().toLocaleLowerCase()) {


                $.post("GetProjectList.aspx", { "id": "p", "PostInfo": Info, "pid": ProjectID, "UserNo": $("#UserTxt").val(), "Xz": Is_Xz }, function (data) {

                    if (data == "ok") {
                        $.post("Send.aspx", { "Content": $("#UserID").val() + "^" + $("#Titlestr").text() }, function (data33) {

                        

                            alert("提交成功,请等待后台申请");
                            $("#querycon2").css("display", "none");
                            $("#bakc").css('display', 'none');
                        });
                    }
                    else
                        alert(data);
                });
            }

            else {
                alert("验证码错误");

            }
        }
        else {
            alert("资料不完整");
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
    $.post("GetProjectList.aspx", { "id": "b" }, function (data) {

        $("#demo1").html("");
        var _ulstr = "<ul> ";
        var ob=eval('('+data+')');
        for (var x =0; x < ob.length; x++)
        {
            var n = ob[x].T_ProductName;
            _ulstr += "<li>恭喜：<span>" + ob[x].T_ProductName.substring(0, ob[x].T_ProductName.length - 3) + "***" + "</span>&nbsp;成功办理&nbsp;<span>" + ob[x].T_ProClassName + "</span></li>";

        }
        _ulstr+="</ul>"
        $("#demo1").html(_ulstr);
        notice();
    });
}



function CheckUseIsLogin() {

    $.post("wapstyle/CheckIsUser.aspx", { "l": "", "uid": "1111" }, function (data) {


        if (data != "0") {
            //$(".user").hide();

            $("#useid").val(data.split('^')[0]);
          
            $("#UserTxt").val(data.split('^')[0]);
        }


    });
}


function SetUpload()
{
    $("input[type=file]").change(function () { $(this).parents(".uploader").find(".filename").val($(this).val()); });
    $("input[type=file]").each(function () {
        if ($(this).val() == "") { $(this).parents(".uploader").find(".filename").val(""); }
    });
}

var t = null;
//t = setTimeout(time, 1000);//开始执行
function time() {
    //clearTimeout(t);//清除定时器
    dt = new Date();
    var h = dt.getHours();
    var m = dt.getMinutes();
    var s = dt.getSeconds();
    var year = dt.getYear();
    var day = dt.getDate();
    var month = parseInt(dt.getMonth()) + 1;

   // document.getElementById("timel").innerHTML = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s + "";
    //t = setTimeout(time, 1000); //设定定时器，循环执行             
}