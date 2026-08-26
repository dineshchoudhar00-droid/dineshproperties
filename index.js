document.addEventListener("DOMContentLoaded", async function () {

    const SUPABASE_URL =
        "https://ethsgbotrdrlazgmbxpj.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_Rn5iBSUhE8kF2m78nDP-ig_NKVXfHE6";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    const propertyGrid =
        document.getElementById("propertyGrid");


    // Element check
    if (!propertyGrid) {

        console.error(
            "ERROR: propertyGrid nahi mila."
        );

        return;
    }


    propertyGrid.innerHTML =
        "<p>Properties load ho rahi hain...</p>";


    // =====================================
    // GET PROPERTIES
    // =====================================

    const {
        data,
        error
    } = await supabaseClient
        .from("properties")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        console.error(
            "SUPABASE ERROR:",
            error
        );


        propertyGrid.innerHTML = `
            <div>
                <h3>Properties load nahi ho rahi</h3>
                <p>${error.message}</p>
            </div>
        `;

        return;
    }


    console.log(
        "SUPABASE PROPERTIES:",
        data
    );


    // =====================================
    // NO PROPERTY
    // =====================================

    if (!data || data.length === 0) {

        propertyGrid.innerHTML = `
            <div>
                <h3>No Properties Available</h3>
                <p>Abhi koi property add nahi hui.</p>
            </div>
        `;

        return;
    }


    // =====================================
    // DISPLAY
    // =====================================

    propertyGrid.innerHTML = "";


    data.forEach(function (property) {

        let imageUrl = "";


        if (property.images) {

            imageUrl =
                property.images
                    .split(",")[0]
                    .trim();

        }


        const card =
            document.createElement("div");


        card.className =
            "property-card";


        card.innerHTML = `

            <div class="property-image">

                ${
                    imageUrl

                    ?

                    `
                    <img
                        src="${imageUrl}"
                        alt="${property.title || "Property"}"
                    >
                    `

                    :

                    `
                    <div class="no-image">
                        No Image
                    </div>
                    `
                }

            </div>


            <div class="property-info">

                <span class="property-type">
                    ${property.type || "Property"}
                </span>


                <h3>
                    ${property.title || "Property"}
                </h3>


                <p>
                    📍 ${property.location || ""}
                </p>


                <p>
                    📐 ${property.area || ""}
                </p>


                <h4>
                    ${property.price || "Price on request"}
                </h4>


                <button
                    class="view-property-btn"
                    onclick="openProperty(${property.id})"
                >
                    View Details
                </button>

            </div>

        `;


        propertyGrid.appendChild(card);

    });

});


// =====================================
// VIEW PROPERTY
// =====================================

function openProperty(id) {

    window.location.href =
        "property.html?id=" + id;

}