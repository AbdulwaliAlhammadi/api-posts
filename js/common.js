const main = el(document, '#main');



const footerContent = `
    <footer id="footer" class="footer mt-auto p-4 bg-dark text-white text-center fw-bold fs-4">
        Copyright &copy; A.A. @2023
        <div class="fs-5 fw-normal">
            Done By <span class="fst-italic fw-bolder">Abdulwali Al-Hammadi</span>
        </div>
    </footer>
`;



const bodyContent = `
    <div id="body" class="mb-auto">
      
    </div>
`;

renderHtml(main, bodyContent);
renderHtml(main, footerContent);
main.classList.add("d-flex" ,"flex-column", "vh-100");
const body = el(document, '#body');

