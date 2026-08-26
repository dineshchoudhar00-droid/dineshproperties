// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://ethsgbotrdrlazgmbxpj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Rn5iBSUhE8kF2m78nDP-ig_NKVXfHE6";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ==========================================
// LOGIN CHECK
// ==========================================

if (
    sessionStorage.getItem("dealerLoggedIn") !== "true"
) {
    window.location.href = "login.html";
}


// ==========================================
// ADD PROPERTY BUTTON
// ==========================================

const addPropertyBtn =
    document.getElementById("addPropertyBtn");

if (addPropertyBtn) {

    addPropertyBtn.onclick = function () {

        window.location.href =
            "add-property.html";

    };

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = function () {

        sessionStorage.removeItem(
            "dealerLoggedIn"
        );

        window.location.href =
            "login.html";

    };

}


// ==========================================
// PROPERTY LIST
// ==========================================

const propertyList =
    document.querySelector(".property-list");


// ==========================================
// LOAD PROPERTIES
// ==========================================

async function loadProperties() {

    propertyList.innerHTML = `
        <div class="empty-property">
            Loading properties...
        </div>
    `;


    const { data, error } =
        await supabaseClient
            .from("properties")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        propertyList.innerHTML = `
            <div class="empty-property">

                <h3>
                    Error Loading Properties
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

        return;
    }


    if (!data || data.length === 0) {

        propertyList.innerHTML = `
            <div class="empty-property">

                <h3>
                    No Properties Added
                </h3>

                <p>
                    Click Add New Property
                    to add a property.
                </p>

            </div>
        `;

        return;
    }


    propertyList.innerHTML = "";


    data.forEach(function (property) {

        const card =
            document.createElement("div");

        card.className =
            "property-card";


        // ----------------------------------
        // IMAGE
        // ----------------------------------

        let imageUrl = "";

        if (property.images) {

            imageUrl =
                property.images
                    .split(",")[0]
                    .trim();

        }


        let imageHTML = "";

        if (imageUrl) {

            imageHTML = `
                <img
                    src="${imageUrl}"
                    alt="${property.title}"
                >
            `;

        } else {

            imageHTML = `
                <div class="no-image">
                    No Image
                </div>
            `;

        }


        // ----------------------------------
        // CARD
        // ----------------------------------

        card.innerHTML = `

            <div class="property-image">

                ${imageHTML}

            </div>


            <div class="property-info">

                <span class="property-type">
                    ${property.type || "Property"}
                </span>


                <h3>
                    ${property.title || "Untitled"}
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


                <div class="property-actions">

                    <button
                        onclick="viewProperty(${property.id})"
                    >
                        View Details
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteProperty(${property.id})"
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>

        `;


        propertyList.appendChild(card);

    });

}


// ==========================================
// VIEW PROPERTY
// ==========================================

function viewProperty(id) {

    window.location.href =
        "property.html?id=" + id;

}


// ==========================================
// DELETE PROPERTY
// ==========================================

// ==========================================
// DELETE PROPERTY + IMAGES
// ==========================================

async function deleteProperty(id) {

    const confirmDelete = confirm(
        "Kya aap is property ko permanently delete karna chahte hain?"
    );

    if (!confirmDelete) {
        return;
    }

    // ==============================
    // PROPERTY CHECK
    // ==============================

    const { data: property, error: fetchError } =
        await supabaseClient
            .from("properties")
            .select("*")
            .eq("id", id)
            .single();

    if (fetchError) {

        alert("Property fetch error:\n" + fetchError.message);
        console.error(fetchError);

        return;
    }


    console.log("PROPERTY BEFORE DELETE:", property);


    // ==============================
    // DATABASE DELETE
    // ==============================

    const { data: deletedProperty, error: deleteError } =
        await supabaseClient
            .from("properties")
            .delete()
            .eq("id", id)
            .select();


    if (deleteError) {

        alert(
            "DATABASE DELETE ERROR:\n" +
            deleteError.message
        );

        console.error(deleteError);

        return;
    }


    console.log(
        "DATABASE DELETE RESULT:",
        deletedProperty
    );


    // ==============================
    // IMPORTANT CHECK
    // ==============================

    if (
        !deletedProperty ||
        deletedProperty.length === 0
    ) {

        alert(
            "Property delete nahi hui.\n\n" +
            "Supabase ne 0 rows delete ki hain.\n\n" +
            "RLS DELETE policy check karni hogi."
        );

        return;
    }


    // ==============================
    // SUCCESS
    // ==============================

    alert(
        "Property database se delete ho gayi! ✅"
    );


    loadProperties();

}
// ==========================================
// START
// ==========================================

loadProperties();