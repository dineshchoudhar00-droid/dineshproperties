// ==========================================
// PROPERTY ID URL SE NIKALNA
// ==========================================

const urlParams = new URLSearchParams(window.location.search);

const propertyId = urlParams.get("id");


// ==========================================
// PROPERTY DETAILS CONTAINER
// ==========================================

const container =
    document.getElementById("propertyDetails");


// ==========================================
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
    "https://ethsgbotrdrlazgmbxpj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Rn5iBSUhE8kF2m78nDP-ig_NKVXfHE6";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// PROPERTY LOAD KARNA
// ==========================================

async function loadProperty() {

    if (!propertyId) {

        showNotFound();

        return;

    }


    container.innerHTML = `

        <div class="not-found">

            <p>Loading property...</p>

        </div>

    `;


    // ======================================
    // SUPABASE SE PROPERTY LENA
    // ======================================

    const {
        data: property,
        error
    } =
        await supabaseClient
            .from("properties")
            .select("*")
            .eq("id", propertyId)
            .single();


    // ======================================
    // ERROR
    // ======================================

    if (error) {

        console.error(
            "PROPERTY ERROR:",
            error
        );


        showNotFound();

        return;

    }


    // ======================================
    // PROPERTY NAHI MILI
    // ======================================

    if (!property) {

        showNotFound();

        return;

    }


    console.log(
        "PROPERTY DETAILS:",
        property
    );


    // ======================================
    // IMAGES
    // ======================================

    let gallery = "";


    if (property.images) {

        let images = [];


        // Agar images string hai
        if (
            typeof property.images === "string"
        ) {

            images =
                property.images
                    .split(",")
                    .map(function(image) {

                        return image.trim();

                    })
                    .filter(Boolean);

        }


        // Agar images array hai
        else if (
            Array.isArray(property.images)
        ) {

            images = property.images;

        }


        // Images banana
        if (images.length > 0) {

            images.forEach(
                function(image) {

                    gallery += `

                        <img
                            src="${image}"
                            class="gallery-image"
                            alt="Property Image"
                        >

                    `;

                }
            );

        }

    }


    // Agar image nahi hai
    if (!gallery) {

        gallery = `

            <div class="no-image">

                No Image Available

            </div>

        `;

    }


    // ======================================
    // PROPERTY DETAILS SHOW KARNA
    // ======================================

    container.innerHTML = `

        <div class="property-page">


            <!-- =========================
                 PROPERTY IMAGES
            ========================== -->

            <div class="property-gallery">

                ${gallery}

            </div>


            <!-- =========================
                 PROPERTY INFORMATION
            ========================== -->

            <div class="property-content">


                <span class="property-type">

                    ${
                        property.type ||
                        "Property"
                    }

                </span>


                <h2>

                    ${
                        property.title ||
                        "Property"
                    }

                </h2>


                <div class="price">

                    ${
                        property.price ||
                        "Price on request"
                    }

                </div>


                <div class="details">


                    <p>

                        <strong>
                            Property Type:
                        </strong>

                        ${
                            property.type ||
                            "Not available"
                        }

                    </p>


                    <p>

                        <strong>
                            Location:
                        </strong>

                        ${
                            property.location ||
                            "Not available"
                        }

                    </p>


                    <p>

                        <strong>
                            Area:
                        </strong>

                        ${
                            property.area ||
                            "Not available"
                        }

                    </p>


                </div>


                <!-- =========================
                     DESCRIPTION
                ========================== -->

                <div class="description">


                    <h3>
                        Description
                    </h3>


                    <p>

                        ${
                            property.description ||
                            "No description available."
                        }

                    </p>


                </div>


                <!-- =========================
                     CONTACT
                ========================== -->

                <div class="contact-buttons">


                    <a
                        href="tel:+919876543210"
                        class="call-btn"
                    >

                        📞 Call Dealer

                    </a>


                    <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        class="whatsapp-btn"
                    >

                        💬 WhatsApp

                    </a>


                </div>


            </div>


        </div>

    `;

}


// ==========================================
// PROPERTY NOT FOUND
// ==========================================

function showNotFound() {

    container.innerHTML = `

        <div class="not-found">

            <h2>
                Property Not Found
            </h2>

            <p>
                This property does not exist
                or could not be loaded.
            </p>


            <button onclick="goBack()">

                Go Back

            </button>

        </div>

    `;

}


// ==========================================
// BACK BUTTON
// ==========================================

function goBack() {

    window.history.back();

}


// ==========================================
// START
// ==========================================

loadProperty();