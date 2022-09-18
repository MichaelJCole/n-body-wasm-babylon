import { ILoadingScreen } from '@babylonjs/core/Loading/loadingScreen'

export class CustomLoadingScreen implements ILoadingScreen {
  //optional, but needed due to interface definitions
  public loadingUIBackgroundColor: string = '#ffffff'

  constructor(public loadingUIText: string) {}

  public displayLoadingUI() {
    console.log('displayLoadingUI')
  }

  public hideLoadingUI() {
    const canvas = document.getElementById('babylon')
    if (canvas) canvas.style.display = 'block'
    const loading = document.getElementById('loading')
    if (loading) loading.style.display = 'none'
    console.log('hideLoadingUI')
  }
}
