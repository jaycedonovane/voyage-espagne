// Carnet de voyage Espagne 2026
// Données : js/photos.js (PHOTOS) et js/jours.js (JOURS, TAGS).
(function () {
    "use strict";

    const $ = (sel, racine = document) => racine.querySelector(sel);
    const DOSSIER_GRAND = "assets/img/full/";
    const DOSSIER_PETIT = "assets/img/thumb/";
    const DOSSIER_MOYEN = "assets/img/medium/";
    const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Liste à plat de toutes les photos affichables (utilisée par la visionneuse)
    const diapos = [];

    // ==========================================================
    // Construction de la page
    // ==========================================================
    function construirePage() {
        const conteneur = $("#jours");
        const menu = $("#menu-liste");
        const etapes = $("#liste-etapes");
        const piedEtapes = $("#pied-etapes");

        // photos retrouvées par leur numéro d'origine (les photos supprimées n'y sont plus)
        const parNumero = new Map(PHOTOS.map((p) => [parseInt(p.id.slice(-3), 10), p]));
        const favoris = new Map(FAVORIS.map((f) => [f.n, f]));
        const indexParId = new Map();

        menu.insertAdjacentHTML("beforeend", `<li><a href="#coups-de-coeur">&#9733; Coups de cœur</a></li>`);

        JOURS.forEach((jour) => {
            menu.insertAdjacentHTML("beforeend", `<li><a href="#${jour.id}">${jour.nav}</a></li>`);
            etapes.insertAdjacentHTML("beforeend", `<li><a href="#${jour.id}">${jour.titre}</a></li>`);
            piedEtapes.insertAdjacentHTML("beforeend", `<li><a href="#${jour.id}">${jour.nav} : ${jour.titre}</a></li>`);

            let html = `
            <section class="jour" id="${jour.id}">
                <div class="jour-tete">
                    <div class="calendrier" aria-hidden="true"><b>${jour.mois}</b><span>${jour.jour}</span></div>
                    <div>
                        <h2>${jour.titre}</h2>
                        <p class="jour-date">${jour.date}</p>
                    </div>
                </div>
                <p class="jour-texte">${jour.texte}</p>`;

            jour.groupes.forEach((groupe) => {
                const numeros = [];
                for (let n = groupe.de; n <= groupe.a; n++) if (parNumero.has(n)) numeros.push(n);
                if (numeros.length === 0) return;   // groupe entièrement supprimé

                const nb = numeros.length;
                html += `
                <div class="groupe" id="${groupe.id}">
                    <h3>${groupe.titre} <small>${nb} photo${nb > 1 ? "s" : ""}</small></h3>
                    <ul class="galerie">`;
                numeros.forEach((n, k) => {
                    const photo = parNumero.get(n);
                    const fav = favoris.get(n);
                    const index = diapos.length;
                    indexParId.set(photo.id, index);
                    diapos.push({
                        id: photo.id, w: photo.w, h: photo.h,
                        legende: fav ? `★ ${fav.titre} · ${jour.nav}` : `${jour.nav} · ${groupe.titre}`
                    });
                    html += `
                        <li><a${fav ? ' class="favori"' : ""} href="${DOSSIER_GRAND}${photo.id}.jpg" data-index="${index}" aria-label="${groupe.titre}, photo ${k + 1} : voir en grand${fav ? " (coup de cœur)" : ""}">
                            <img src="${DOSSIER_PETIT}${photo.id}.jpg" alt="${fav ? fav.titre : groupe.titre + ", photo " + (k + 1)}" width="${photo.w}" height="${photo.h}" loading="lazy" decoding="async">
                        </a></li>`;
                });
                html += `
                    </ul>
                </div>`;
            });

            html += "</section>";
            conteneur.insertAdjacentHTML("beforeend", html);
        });

        // section "Coups de cœur" : mosaïque avec la première photo en grand
        let mosaique = "";
        FAVORIS.forEach((fav) => {
            const photo = parNumero.get(fav.n);
            if (!photo) return;
            mosaique += `
                <li><a href="${DOSSIER_GRAND}${photo.id}.jpg" data-index="${indexParId.get(photo.id)}" aria-label="${fav.titre} : voir en grand">
                    <img src="${DOSSIER_MOYEN}${photo.id}.jpg" alt="${fav.titre}" loading="lazy" decoding="async">
                    <span class="etoile" aria-hidden="true">★</span>
                    <span class="legende">${fav.titre}</span>
                </a></li>`;
        });
        conteneur.insertAdjacentHTML("beforebegin", `
            <section class="coeur" id="coups-de-coeur">
                <h2><span class="etoile-titre" aria-hidden="true">★</span> Coups de cœur</h2>
                <p>Les photos que je préfère de tout le voyage. Clique pour les voir en grand : elles se retrouvent aussi dans les jours, marquées d'une étoile.</p>
                <ul class="mosaique">${mosaique}
                </ul>
            </section>`);

        $("#nuage").innerHTML = TAGS.map(
            (t) => `<a class="p${t.poids}" href="#${t.cible}">${t.label}</a>`
        ).join(" ");

        $("#nb-photos").textContent = String(diapos.length);
    }

    // ==========================================================
    // Menu : onglet actif selon la section visible
    // (et, sur mobile, l'onglet actif reste visible dans la barre qui défile)
    // ==========================================================
    function suivreSection() {
        if (!("IntersectionObserver" in window)) return;
        const barre = $("#menu-liste");
        const liens = new Map();
        document.querySelectorAll("#menu a").forEach((a) => liens.set(a.getAttribute("href").slice(1), a));

        const observateur = new IntersectionObserver(
            (entrees) => {
                entrees.forEach((e) => {
                    if (!e.isIntersecting) return;
                    liens.forEach((a) => a.classList.remove("actif"));
                    const lien = liens.get(e.target.id);
                    if (!lien) return;
                    lien.classList.add("actif");
                    if (barre.scrollWidth > barre.clientWidth) {
                        barre.scrollTo({
                            left: lien.offsetLeft - (barre.clientWidth - lien.offsetWidth) / 2,
                            behavior: mouvementReduit.matches ? "auto" : "smooth"
                        });
                    }
                });
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );
        document.querySelectorAll("#accueil, #coups-de-coeur, .jour").forEach((s) => observateur.observe(s));
    }

    // ==========================================================
    // Confettis (canvas, sans bibliothèque)
    // Déclenchés uniquement à l'OUVERTURE de la visionneuse.
    // ==========================================================
    const confettis = (function () {
        const canvas = $("#confettis");
        const ctx = canvas.getContext("2d");
        const COULEURS = ["#ff8a00", "#ffd23f", "#e53935", "#2f86d6", "#6fb6f2", "#ffffff", "#8bc34a", "#f06292"];
        let anim = 0;

        function lancer() {
            if (mouvementReduit.matches) return;
            cancelAnimationFrame(anim);

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const L = window.innerWidth;
            const H = window.innerHeight;
            canvas.width = Math.round(L * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const gravite = H * 1.6;           // px/s²
            const chuteMax = H * 0.38;         // vitesse de chute limite (papier léger)
            const total = L < 520 ? 110 : 170;
            const alea = (a, b) => a + Math.random() * (b - a);

            // deux "canons" dans les coins du bas, tirant vers le centre
            const pieces = [];
            for (let i = 0; i < total; i++) {
                const gauche = i % 2 === 0;
                const angle = alea(0.12, 0.85);                 // écart par rapport à la verticale (rad)
                const vitesse = alea(1.15, 1.9) * H;
                pieces.push({
                    x: gauche ? L * 0.03 : L * 0.97,
                    y: H * 0.97,
                    vx: (gauche ? 1 : -1) * Math.sin(angle) * vitesse * (L < H ? 0.7 : 1),
                    vy: -Math.cos(angle) * vitesse,
                    larg: alea(6, 11),
                    haut: alea(9, 16),
                    rot: alea(0, Math.PI * 2),
                    vrot: alea(-9, 9),
                    phase: alea(0, Math.PI * 2),
                    vphase: alea(6, 14),
                    couleur: COULEURS[(Math.random() * COULEURS.length) | 0]
                });
            }

            const DUREE = 3.2;
            let debut = 0;
            let dernier = 0;

            function image(t) {
                if (!debut) { debut = t; dernier = t; }
                const dt = Math.min((t - dernier) / 1000, 0.05);
                const ecoule = (t - debut) / 1000;
                dernier = t;

                ctx.clearRect(0, 0, L, H);
                const frein = Math.pow(0.18, dt);   // frottement de l'air
                for (const p of pieces) {
                    p.vx *= frein;
                    p.vy += gravite * dt;
                    if (p.vy > chuteMax) p.vy = chuteMax;
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.rot += p.vrot * dt;
                    p.phase += p.vphase * dt;

                    const fondu = ecoule > DUREE - 0.7 ? Math.max(0, (DUREE - ecoule) / 0.7) : 1;
                    ctx.save();
                    ctx.globalAlpha = fondu;
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot);
                    ctx.scale(1, Math.cos(p.phase));    // effet de retournement
                    ctx.fillStyle = p.couleur;
                    ctx.fillRect(-p.larg / 2, -p.haut / 2, p.larg, p.haut);
                    ctx.restore();
                }

                if (ecoule < DUREE) anim = requestAnimationFrame(image);
                else ctx.clearRect(0, 0, L, H);
            }
            anim = requestAnimationFrame(image);
        }

        function arreter() {
            cancelAnimationFrame(anim);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        return { lancer, arreter };
    })();

    // ==========================================================
    // Visionneuse : zoom plein écran
    //  - clic / toucher sur une miniature : la photo grandit depuis sa place + confettis
    //  - flèches à l'écran, flèches du clavier (←→↑↓), glissement du doigt : photo suivante / précédente
    //  - pas de confettis quand on passe d'une photo à l'autre
    // ==========================================================
    function visionneuse() {
        const boite = $("#visionneuse");
        const img = $("#vis-img");
        const legende = $("#vis-legende");
        const compteur = $("#vis-compteur");
        const bFermer = $(".vis-fermer", boite);
        const bPrec = $(".vis-prec", boite);
        const bSuiv = $(".vis-suiv", boite);

        let courant = 0;
        let declencheur = null;
        let jeton = 0;

        const ouverte = () => !boite.classList.contains("cachee");

        // Calcule la taille d'affichage de la photo pour qu'elle remplisse l'écran sans déformation
        function ajuster() {
            const d = diapos[courant];
            const style = getComputedStyle(boite);
            const bord = 10;   // 2 x 5 px de bordure blanche
            const largeurDispo = boite.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - bord;
            const hauteurDispo = boite.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
                - $("figcaption", boite).offsetHeight - bord;
            const echelle = Math.min(largeurDispo / d.w, hauteurDispo / d.h, 1);
            img.style.width = Math.max(1, Math.floor(d.w * echelle)) + "px";
            img.style.height = Math.max(1, Math.floor(d.h * echelle)) + "px";
        }

        function afficher(i, sens) {
            courant = (i + diapos.length) % diapos.length;
            const d = diapos[courant];
            const moi = ++jeton;

            legende.textContent = d.legende;
            compteur.textContent = `Photo ${courant + 1} sur ${diapos.length}`;
            img.alt = d.legende;
            ajuster();

            // miniature tout de suite (déjà en cache), puis version grande qualité
            img.src = `${DOSSIER_PETIT}${d.id}.jpg`;
            const grande = new Image();
            grande.onload = () => { if (moi === jeton) img.src = grande.src; };
            grande.src = `${DOSSIER_GRAND}${d.id}.jpg`;

            // petit glissement dans le sens du déplacement (sans confettis)
            if (sens && img.animate && !mouvementReduit.matches) {
                img.animate(
                    [{ transform: `translateX(${sens * 48}px)`, opacity: 0.15 }, { transform: "none", opacity: 1 }],
                    { duration: 240, easing: "cubic-bezier(.2,.8,.3,1)" }
                );
            }

            // précharge les deux voisines
            [courant - 1, courant + 1].forEach((k) => {
                new Image().src = `${DOSSIER_GRAND}${diapos[(k + diapos.length) % diapos.length].id}.jpg`;
            });
        }

        function suivante() { afficher(courant + 1, 1); }
        function precedente() { afficher(courant - 1, -1); }

        function ouvrir(i, source) {
            declencheur = source || null;
            boite.classList.remove("cachee");
            boite.classList.add("ouverte");
            document.body.style.overflow = "hidden";
            afficher(i, 0);

            // effet de zoom : la photo part de la miniature cliquée et grandit jusqu'au centre
            const vignette = source && source.querySelector("img");
            if (vignette && img.animate && !mouvementReduit.matches) {
                const de = vignette.getBoundingClientRect();
                const vers = img.getBoundingClientRect();
                if (vers.width > 0 && de.width > 0) {
                    const dx = (de.left + de.width / 2) - (vers.left + vers.width / 2);
                    const dy = (de.top + de.height / 2) - (vers.top + vers.height / 2);
                    const e = de.width / vers.width;
                    img.animate(
                        [{ transform: `translate(${dx}px, ${dy}px) scale(${e})`, opacity: 0.6 }, { transform: "none", opacity: 1 }],
                        { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" }
                    );
                }
            }

            confettis.lancer();   // uniquement ici : à l'ouverture
            bFermer.focus({ preventScroll: true });
        }

        function fermer() {
            boite.classList.add("cachee");
            boite.classList.remove("ouverte");
            document.body.style.overflow = "";
            jeton++;
            img.removeAttribute("src");
            confettis.arreter();
            if (declencheur) declencheur.focus({ preventScroll: true });
        }

        // clic ou toucher sur une miniature (délégation)
        document.addEventListener("click", (e) => {
            const lien = e.target.closest("a[data-index]");
            if (!lien) return;
            e.preventDefault();
            ouvrir(Number(lien.dataset.index), lien);
        });

        bFermer.addEventListener("click", fermer);
        bPrec.addEventListener("click", precedente);
        bSuiv.addEventListener("click", suivante);
        boite.addEventListener("click", (e) => { if (e.target === boite) fermer(); });

        // clavier : ← ↑ PageHaut = précédente ; → ↓ PageBas = suivante
        document.addEventListener("keydown", (e) => {
            if (!ouverte()) return;
            switch (e.key) {
                case "Escape": fermer(); break;
                case "ArrowLeft": case "ArrowUp": case "PageUp": e.preventDefault(); precedente(); break;
                case "ArrowRight": case "ArrowDown": case "PageDown": e.preventDefault(); suivante(); break;
                case "Home": e.preventDefault(); afficher(0, -1); break;
                case "End": e.preventDefault(); afficher(diapos.length - 1, 1); break;
                case "Tab": {
                    const boutons = [bFermer, bPrec, bSuiv];
                    const pos = boutons.indexOf(document.activeElement);
                    e.preventDefault();
                    boutons[(pos + (e.shiftKey ? -1 : 1) + boutons.length) % boutons.length].focus();
                    break;
                }
            }
        });

        // glissement du doigt : vers la gauche = suivante, vers la droite = précédente
        let departX = null, departY = null;
        boite.addEventListener("touchstart", (e) => {
            if (e.touches.length !== 1) { departX = null; return; }   // pincement : on laisse le zoom du navigateur
            departX = e.touches[0].clientX;
            departY = e.touches[0].clientY;
        }, { passive: true });
        boite.addEventListener("touchend", (e) => {
            if (departX === null) return;
            const dx = e.changedTouches[0].clientX - departX;
            const dy = e.changedTouches[0].clientY - departY;
            departX = null;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
                if (dx < 0) suivante(); else precedente();
            }
        }, { passive: true });

        // rotation du téléphone, dépliage / repliage d'un écran pliant, redimensionnement
        window.addEventListener("resize", () => { if (ouverte()) ajuster(); });
        window.addEventListener("orientationchange", () => { if (ouverte()) setTimeout(ajuster, 200); });
    }

    construirePage();
    suivreSection();
    visionneuse();
})();
