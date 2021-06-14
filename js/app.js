$(function(){

    let displayWorks = 5;

    let worksSlider = $('[data-slider="slick"]');

    /* Filter */
    ///////////////////////////////////////////
    let filter = $("[data-filter]");

    filter.on("click", function(event){
        event.preventDefault();

        let cat = $(this).data("filter");

        if(cat == "all"){
            $("[data-cat]").removeClass("hide");
        }else{
            $("[data-cat]").each(function(){
                let workCat = $(this).data("cat");
    
                if(workCat != cat){
                    $(this).addClass("hide");
                }else{
                    $(this).removeClass("hide");
                }
            });
        }
    });

    /* Modal */
    ///////////////////////////////////////////

    let modalCall = $("[data-modal]");
    let modalClose = $(".modal__close");

    // Add scale for modal window
    function addCssScale(element, value){
        $(element).find(".modal__dialog").css({
            transform: "scale("+ value +")"
        });
    }

    // Show modal window
    modalCall.on("click", function(event){
        event.preventDefault();

        let $this = $(this);
        let modalId = $this.data("modal");

        $(modalId).addClass("show");
        $("body").addClass("no-scroll");

        setTimeout(function(){
            addCssScale(modalId, 1);
        }, 200);

        worksSlider.slick("setPosition");

    });

    // Hide modal window (click close button)
    modalClose.on("click", function(event){
        event.preventDefault();

        let $this = $(this);
        let modalParent = $this.parents(".modal");

        $(modalParent).removeClass("show");
        $("body").removeClass("no-scroll");

        addCssScale(modalParent, 0);

    });

    // Hide modal window (click around modal window)
    $(".modal").on("click", function(){
        $(this).removeClass("show");
        $("body").removeClass("no-scroll");

        addCssScale(this, 0);

    });

    $(".modal__dialog").on("click", function(event){
        event.stopPropagation();
    });

    /* Slider: https://kenwheeler.github.io/slick/ */
    ///////////////////////////////////////////

    worksSlider.slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: false,
        dots: true
      });

      $(".slickPrev").on("click", function(event){
          event.preventDefault();
          let currentSlider = $(this).parents(".modal").find('[data-slider="slick"]');

          currentSlider.slick("slickPrev");
      });

      $(".slickNext").on("click", function(event){
        event.preventDefault();
          let currentSlider = $(this).parents(".modal").find('[data-slider="slick"]');

          currentSlider.slick("slickNext");
    });



    /* Load Work */
    ///////////////////////////////////////////

    //Hide Works/Show Works
    function addWorksClass(quantity, addClas, removeClas){
        let works = $('.portfolio__col');

        if(quantity == "all"){
            for (let i = 0; i < works.length; i++) {
                $(works[i]).addClass(addClas);
                $(works[i]).removeClass(removeClas);
            }
            
        }else{
            for (let i = 0; i < works.length; i++) {
                if(i > quantity){
                    $(works[i]).addClass(addClas);
                    $(works[i]).removeClass(removeClas);
                }
            }
        }
    }

    addWorksClass(displayWorks, "hide", "show");


    // Load Btn
    let loadWorkBtn = $("[data-state]");

    loadWorkBtn.on("click", function(event){
        event.preventDefault();
        let btnData = loadWorkBtn.data("state");
        console.log(btnData);
        
        if(btnData == "load"){
            addWorksClass("all", "", "hide");
            loadWorkBtn.text("Hide More");
            loadWorkBtn.data("state", "hide");

        }

        if(btnData == "hide"){
            addWorksClass(displayWorks, "hide", "");
            loadWorkBtn.text("Load More");
            loadWorkBtn.data("state", "load");
        }
    });


    /* Mobile Nav */
    ///////////////////////////////////////////

    // Burger Button
    $(".burger__container").on("click", function(){
        let navToggle = $("#navToggle");
        let nav = $("#nav");
    
        $(this).toggleClass("change");

        nav.toggleClass("display");
    });


    /* Modal window Work */
    ///////////////////////////////////////////
    let workIds = $('[data-modal="#modal_project"]');
    let workCat = $("#workCat");
    let workText = $("#workText");
    let workYear = $("#workYear");
    let workTitle = $("#workTitle");
    let workLink = $("#workLink");

    workIds.each(function(){
        $this = $(this);

        $this.on("click",function(){
            // Remove Slider Images
            $(".slick__images").remove();

            let elemId = Number.parseInt($(this).attr("id"));

            $.getJSON('js/json/projects-description.json', function(data){
                $(data.projects).each(function(i, value){
                    if(value.work_id == elemId){
                        let projectLinks = value.project_link.split(",");
                        let photos = value.photos_path.split(",");


                        workCat.text(value.category);
                        workYear.text(value.date_year);
                        workTitle.text(value.title);
                        workText.text(value.description);

                        workLink.text(projectLinks[0]);
                        workLink.attr("href", projectLinks[1]);


                        for (let i = 0; i < photos.length; i++) {
                            worksSlider.slick('slickAdd','<div class="slick__images"><img class="modal-work__photo img" id="workImage" src="'+ photos[i] +'" alt="Project preview"> </div>');
                        }

                        //Delete prev/next slider buttons

                        if(photos.length < 2){
                            $(".modal-work__footer").addClass("hide");
                        }else{
                            $(".modal-work__footer").removeClass("hide");
                        }

                    }
                });
            });
        });
    });

});