import requests
import json
import webbrowser

def buscarAlbum():

    banda = input('Ingrese la banda a buscar: ')
    limiteBusqueda = input('Ingrese limite de busqueda: ')
    url = 'https://api.spotify.com/v1/search?q=' + banda + '&type=album&limit=' + limiteBusqueda
    respuestaBusquedaBanda = requests.get(url)
    dataBanda = json.loads(respuestaBusquedaBanda.text)
    urlAlbum = dataBanda['albums']['items']
    return urlAlbum, dataBanda

def mostrarAlbums(urlAlbum):

    if len(urlAlbum) != 0:
        for i in range(0, len(urlAlbum)):
            print(i, ')', urlAlbum[i]['name'])
    else:
        print('No se encuentran albums')
        buscarPreviewCancion()

def mostrarCanciones(dataBanda):

    opcionSeleccionadaAlbum = input('Ingrese el numero de su album: ')
    urlAlbum = dataBanda['albums']['items'][int(opcionSeleccionadaAlbum)]['href']
    respuestaAlbum = requests.get(urlAlbum)
    dataAlbum = json.loads(respuestaAlbum.text)
    nombreCancion = dataAlbum['tracks']['items']

    for i in range(0, len(nombreCancion)):
        print(i, ')', nombreCancion[i]['name'])

    return dataAlbum

def previewCancion(dataBanda):
    opcionSeleccionadaCancion = input('Ingrese el numero de su cancion: ')
    urlCancion = dataBanda['tracks']['items'][int(opcionSeleccionadaCancion)]['preview_url']
    print(urlCancion)
    webbrowser.open(urlCancion)

def buscarPreviewCancion():
    urlAlbum, dataBanda = buscarAlbum()
    mostrarAlbums(urlAlbum)
    dataAlbum = mostrarCanciones(dataBanda)
    previewCancion(dataAlbum)

buscarPreviewCancion()