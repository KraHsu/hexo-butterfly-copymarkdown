"use strict";
let reprintButton = document.createElement("div");
reprintButton.id = "reprintedButton";
reprintButton.innerHTML = '<i class="fas fa-paste copy-button"></i>';
let parentElement = document.getElementById("post");
parentElement.insertBefore(reprintButton, parentElement.firstChild);
reprintButton.querySelector("i").addEventListener("click", ArticleReprinted);