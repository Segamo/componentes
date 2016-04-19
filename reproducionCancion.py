import requests
import json
import webbrowser

def buscarCancion():
    banda = input('Ingrese la banda a buscar: ')
    limiteBusqueda = input('Ingrese limite de busqueda: ')

    url = 'https://api.spotify.com/v1/search?q=' + banda + '&type=album&limit=' + limiteBusqueda
    respuestaBusquedaBanda = requests.get(url)

    dataBanda = json.loads(respuestaBusquedaBanda.text)

    urlAlbum = dataBanda['albums']['items']

    if len(urlAlbum) == 0 :
        for i in range(0, len(urlAlbum)):
            print(i, ')', urlAlbum[i]['name'])
        else:
            print('No se encuentran albums')
            buscarCancion()

    opcionSeleccionadaAlbum = input('Ingrese el numero de su album: ')

    urlAlbum = dataBanda['albums']['items'][int(opcionSeleccionadaAlbum)]['href']

    respuestaAlbum = requests.get(urlAlbum)

    dataBanda = json.loads(respuestaAlbum.text)

    nombreCancion = dataBanda['tracks']['items']

    for i in range(0, len(nombreCancion)):
        print(i, ')', nombreCancion[i]['name'])

    opcionSeleccionadaCancion = input('Ingrese el numero de su cancion: ')

    urlCancion = dataBanda['tracks']['items'][int(opcionSeleccionadaCancion)]['preview_url']

    webbrowser.open(urlCancion)

buscarCancion()