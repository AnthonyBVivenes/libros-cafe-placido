



//////////////////////////////////////////////////////////
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function (e) {
    onSearchInput(e.target.value);
});
searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        onSearchEnter(e.target.value);
    }
});


function onSearchInput(value) {
    console.log('Escribiendo:',);


}
function onSearchEnter(value) {
    console.log('Presionaste Enter:', value);

    const parametro1 = value;

    const urlDestino = `shop.html?busqueda=${encodeURIComponent(parametro1)}`;

    window.location.href = urlDestino;
}
