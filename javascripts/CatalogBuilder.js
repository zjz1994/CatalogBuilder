       ///<reference path="jquery1.9.1.js">

     ///////////////////////////////////
    //      Catalog Builder          //
   //       Ver: Alpha 0.3          //
  //        Update: 2016.06.23     //
 //         By: ZJZ               //
///////////////////////////////////
jQuery(document).ready(function ()
{
    build_catalog();
});
function build_catalog()
{
    var headings = jQuery("#content").find("h1,h2,h3,h4,h5,h6");//寻找所有标题
    if (headings.length < 2)
	{
        return;
    }
    var catalog_struct = "";//目录结构
	var tree_block_list = new Array();//新建一个数组存储需要隐藏的目录标题
	var block_list_count=0;//隐藏目录标题计数
    
	catalog_struct += '<div class="toc_title" id="catalog_title">目录</div>'
	catalog_struct += '<div class="toc_tips">1.点击条目直接跳转<br/>2单击目录右边的箭头展开或收起子目录</div>'
    //开始生成目录
	catalog_struct += '<div id="toc">';
    catalog_struct += '<div id="tree" style="top: 35px; left: 0px;" class="tree_div">';
    catalog_struct += '<div id="tree_root" onselectstart="return false" ondragstart="return false">';
    var old_h = 0, branch_count = 0;
    for (var i = 0; i < headings.length; i++) 
    {
        var h = parseInt(headings[i].tagName.substr(1), 10);
        if (!old_h) {
            old_h = h;
        }
        if (h > old_h) {
            catalog_struct += '<div class="show_on treeNode">';
			        if (title.length < 100) //标题长度限制
					{
						catalog_struct += '<span onclick="expand_collapse(this.parentNode)" class="show_on_icon" title=""/>'//设置分支箭头
						//catalog_struct += '<a href="#title_id_'+(i-1)+'" onclick="expand_collapse(this.parentNode)" class="category">' + title + '</a>';//设置分支(分支展开收缩)
						catalog_struct += '<a href="#title_id_'+(i-1)+'" class="category">' + title + '</a>';//设置分支(直接跳转)
						catalog_struct += '<div class="tree_subnodes">';
						tree_block_list[block_list_count]='tree_id_'+(i-1);
						block_list_count ++;
					}
            branch_count++;
        }
        else if (h < old_h && branch_count > 0) {
            catalog_struct += "</div></div>";
            branch_count--;
        }
        if (h == 1) {
            while (branch_count > 0) {
                catalog_struct += "</div></div>";
                branch_count--;
            }
        }
        old_h = h;
        var title = headings.eq(i).text().replace(/^[\d.、\s]+/g, "");
        title = title.replace(/[^a-zA-Z0-9_\-\s\u4e00-\u9fa5]+/g, "");
        if (title.length < 100) //标题长度限制
        {
            //将每一个h标签拼接到s上，生成目录
            catalog_struct += '<div class="treeNode" id="tree_id_'+i+'"><a href="#title_id_' + i + '" class="tree_unselected" onclick="click_anchor(this)">' + title + "</a></div>";
			//给文章中的h标签加上id
            headings.eq(i).html('<a id="title_id_' + i + '" href="#catalog_title">↑</a>' + headings.eq(i).html());
        }
    }
    while (branch_count > 0) {
        catalog_struct += "</div>";
        branch_count--;
    }
    catalog_struct += '</div></div></div>';
	//加上外框
	catalog_struct = '<div class="leftNav">' + catalog_struct;
	catalog_struct += '</div>';
    jQuery(catalog_struct).insertBefore(jQuery("#content"));
	for(var i=0;i<tree_block_list.length;i++)
	{
		display_hide(tree_block_list[i]);
	}
}
function display_hide(el_id)
{
	var target=document.getElementById(el_id);
	target.style.display="none";
}
//////////////////////////////////////////////
var tree_selected = null; //选中的树节点
//父节点展开事件
function expand_collapse(el) {
    //如果父节点有字节点（class 属性为tree_subnodes_hidden），展开所有子节点
    if ((el.className != "show_on treeNode") && (el.className != "show_off treeNode") && (el.className != "treeNode")) {
        return; //判断父节点是否为一个树节点，如果树节点不能展开，请检查是否节点的class属性是否为treeNode
    }

    var child;
    var icon_el; //图片子节点，在树展开时更换图片
    for (var i = 0; i < el.childNodes.length; i++) {
        child = el.childNodes[i];
        if (child.className=="show_on_icon"||child.className=="show_off_icon") {
            icon_el = child;
        } else if (child.className == "tree_subnodes_hidden") {
            child.className = "tree_subnodes"; //原来若隐藏，则展开
			icon_el.className="show_on_icon"
			icon_el.title="单击以收起";
            el.className = "show_on treeNode";
            break;
        } else if (child.className == "tree_subnodes") {
            child.className = "tree_subnodes_hidden"; //原来若展开，则隐藏
			icon_el.className="show_off_icon"
			icon_el.title="单击以展开";
            el.className = "show_off treeNode";
            break;
        }
    }
}
//子节点点击事件，设置选中节点的样式


function click_anchor(el) {
    selectNode(el.parentNode);
    el.blur();
}

function selectNode(el) {
    if (tree_selected != null) {
        set_subNode_Class(tree_selected, 'A', 'tree_unselected');
    }

    set_subNode_Class(el, 'A', 'tree_selected');
    tree_selected = el;
}

function set_subNode_Class(el, nodeName, className) {
    var child;
    for (var i = 0; i < el.childNodes.length; i++) {
        child = el.childNodes[i];
        if (child.nodeName == nodeName) {
            child.className = className;
            break;
        }
    }
}
