<?php 
require_once("include/jobshout_db_init.php");
require_once("include/CONSTANTS.php");
require_once("include/functions.php");
include_once("include/main-header.php");  ?>

</head>
<body>


<?php include_once("include/top-header.php"); ?>


<div class="container">
  <div class="row client">
    <div id="content">
      <div class="container">
        <div class="row">
          <div class="col-md-12" style="margin-top:10px;">
            <h4 class="heading-title"><span>Blog</span></h4>
            <div class="row">
              <div class="col-md-9">
			  <div id="ImageLoadingDiv" style="position: absolute; top:75px; left: 350px; display: block;">
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Loading...<br />
    <img id="imgAjaxLoading" src="images/loading-1.gif" alt="Loading..." style="border-width: 0px;">
    
    <br>
    <br>

    <img src="images/loading.gif" width="109" height="25" />
    <br>
    <br>



    <img src="images/142.GIF" width="160" height="20" /> <br>
<br>

<img src="images/loading1.gif" width="140" height="21" /> <br>
<br>

<img src="images/loading2.gif" width="140" height="18" /><br>
<br>

<img src="images/loading3.GIF" width="150" height="17" />
<br>
<br>

<img src="images/loading4.GIF" width="160" height="20" /> </div>
                <div class="row content_area">
                  
                </div>
                <!--<div class="row">
                  <div class="col-md-10 col-xs-10" ><a href="#" >&#8592;Previous</a></div>
                  <div class="col-md-2 text-right"><a href="#">Next &#8594;</a></div>
                </div>-->
                <br>
              </div>
              <div class="col-md-3">
                <div class="row">
                  <div class="col-md-12">
                    <div class="rightpanel">
                      <h1>Testimonial</h1>
                      <p>Europa Components Luton UK Mandeep Brahia main html Catbase is fantastic program that strong easy us  <a href="https://tenthmatrix.co.uk/europa-components-luton-uk.html">more</a></p>
                    </div>
                    <div class="rightpanel" >
                      <h1>News</h1>
					  <?php
$newsQuery="SELECT Code, Document FROM documents WHERE Type='page' AND SiteID=".SITE_ID." Order by ID DESC Limit 4";
$newsData = $db->get_results($newsQuery);
?>

                      <ul class="ulrightlink" >
                        <?php for($i=0;$i<count($newsData);$i++){?>
						<li><a href="<?php echo $newsData[$i]->Code;?>.html"><?php echo $newsData[$i]->Document;?></a></li>
						<?php }?>
                        
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!---------------clientsays---section-------end-------> 

<?php include_once("include/footer.php"); ?>
<script type="text/javascript">
	$(document).ready(function(){
		$.movePage(1);
	});

	$.movePage = function movePage(pageNum){
		$('.content_area').html("");
		$('#ImageLoadingDiv').show();

		$.ajax({
		  type : "GET",
		  url: "include/json-paging-search.php?pageNum="+pageNum+"&type=blog",
		  cache: false,
		  success: function(html){
			//alert(html);return false;
			if(html!='no'){
				//$('#ImageLoadingDiv').hide();
				//$('.content_area').html(html);
				
			}
		  }
		});
	}
</script>

</body>
</html>