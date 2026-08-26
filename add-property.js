// ==========================================
// SUPABASE CONNECTION
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

if (sessionStorage.getItem("dealerLoggedIn") !== "true") {
    window.location.href = "login.html";
}


// ==========================================
// ELEMENTS
// ==========================================

const form =
    document.getElementById("propertyForm");

const photoInput =
    document.getElementById("photos");

const preview =
    document.getElementById("preview");


// ==========================================
// IMAGE PREVIEW
// ==========================================

photoInput.addEventListener("change", function () {

    preview.innerHTML = "";

    const files =
        Array.from(photoInput.files);

    files.forEach(function (file) {

        const reader =
            new FileReader();

        reader.onload = function (event) {

            const img =
                document.createElement("img");

            img.src = event.target.result;

            img.style.width = "150px";
            img.style.height = "100px";
            img.style.objectFit = "cover";
            img.style.margin = "8px";
            img.style.borderRadius = "8px";

            preview.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

});


// ==========================================
// FORM SUBMIT
// ==========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ------------------------------
        // GET FORM VALUES
        // ------------------------------

        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const type =
            document
                .getElementById("type")
                .value
                .trim();


        const price =
            document
                .getElementById("price")
                .value
                .trim();


        const location =
            document
                .getElementById("location")
                .value
                .trim();


        const area =
            document
                .getElementById("area")
                .value
                .trim();


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const files =
            Array.from(photoInput.files);


        // ------------------------------
        // VALIDATION
        // ------------------------------

        if (!title) {

            alert("Please enter property title.");

            return;

        }


        if (!type) {

            alert("Please select property type.");

            return;

        }


        if (!price) {

            alert("Please enter property price.");

            return;

        }


        if (!location) {

            alert("Please enter property location.");

            return;

        }


        if (!area) {

            alert("Please enter property area.");

            return;

        }


        // ------------------------------
        // BUTTON
        // ------------------------------

        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerText =
                "Uploading...";

        }


        try {

            // ==================================
            // UPLOAD IMAGES
            // ==================================

            const imageUrls = [];


            for (
                let i = 0;
                i < files.length;
                i++
            ) {

                const file = files[i];


                // Unique file name

                const extension =
                    file.name
                        .split(".")
                        .pop();


                const fileName =
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 10) +
                    "." +
                    extension;


                // Upload path

                const filePath =
                    fileName;


                console.log(
                    "Uploading:",
                    file.name
                );


                const uploadResult =
                    await supabaseClient
                        .storage
                        .from("property-images")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl: "3600",
                                upsert: false
                            }
                        );


                if (uploadResult.error) {

                    throw new Error(
                        "Photo upload failed: " +
                        uploadResult.error.message
                    );

                }


                // Get public URL

                const publicResult =
                    supabaseClient
                        .storage
                        .from("property-images")
                        .getPublicUrl(
                            filePath
                        );


                const publicUrl =
                    publicResult
                        .data
                        .publicUrl;


                imageUrls.push(publicUrl);

            }


            // ==================================
            // SAVE PROPERTY IN DATABASE
            // ==================================

            const result =
                await supabaseClient
                    .from("properties")
                    .insert({

                        title: title,

                        type: type,

                        price: price,

                        area: area,

                        location: location,

                        description: description,

                        images:
                            imageUrls.join(",")

                    })
                    .select();


            if (result.error) {

                throw new Error(
                    "Database error: " +
                    result.error.message
                );

            }


            // ==================================
            // SUCCESS
            // ==================================

            console.log(
                "Property saved:",
                result.data
            );


            alert(
                "✅ Property Added Successfully!"
            );


            window.location.href =
                "dashboard.html";


        }

        catch (error) {

            console.error(
                "Property Error:",
                error
            );


            alert(
                "❌ Error:\n\n" +
                error.message
            );


            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerText =
                    "Add Property";

            }

        }

    }
);