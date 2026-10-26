'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
    <button type="button"
        class="search-input-clear"
        aria-label="Clear search"
        data-search-input-clear>&times;</button>
</div>
` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="architecture.html" data-type="chapter-link">
                                        <span class="icon ion-ios-git-branch"></span>Architecture
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' :
                                            'id="xs-controllers-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' }>
                                            <li class="link">
                                                <a href="controllers/LoginController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' :
                                        'id="xs-injectables-links-module-AuthModule-0d704a52d4728bac8d053879f1d486e377ecc66bad1b323d04ab36d610def71f8e368a1a6e7fed81c2758c312ad5206e6aafe040af2219d1ce9882b3a228cb30"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsuariosService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuariosService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GestionModule.html" data-type="entity-link" >GestionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' : 'data-bs-target="#xs-controllers-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' :
                                            'id="xs-controllers-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' }>
                                            <li class="link">
                                                <a href="controllers/MedicoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' : 'data-bs-target="#xs-injectables-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' :
                                        'id="xs-injectables-links-module-GestionModule-736e8c83ee5e6acd805646a4b9d4469ee0eb2f4beb05543d4d8f2de5812a9ca849e66003629e1c4c80fdd0387dd9e6843eccae7a84f7ea3dafd9bd2614e6cb53"' }>
                                        <li class="link">
                                            <a href="injectables/MedicoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReservasService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservasService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsuarioService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuarioService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsuariosModule.html" data-type="entity-link" >UsuariosModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsuariosModule-2139a4f6a4a651486dffd6e701f312ef4c853840030ffe1dd88a21659d6c71f1ad1cb50b8d053b6ca75691f3af6312040a87c1a6a5b93de284de447b12fb2de7"' : 'data-bs-target="#xs-injectables-links-module-UsuariosModule-2139a4f6a4a651486dffd6e701f312ef4c853840030ffe1dd88a21659d6c71f1ad1cb50b8d053b6ca75691f3af6312040a87c1a6a5b93de284de447b12fb2de7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsuariosModule-2139a4f6a4a651486dffd6e701f312ef4c853840030ffe1dd88a21659d6c71f1ad1cb50b8d053b6ca75691f3af6312040a87c1a6a5b93de284de447b12fb2de7"' :
                                        'id="xs-injectables-links-module-UsuariosModule-2139a4f6a4a651486dffd6e701f312ef4c853840030ffe1dd88a21659d6c71f1ad1cb50b8d053b6ca75691f3af6312040a87c1a6a5b93de284de447b12fb2de7"' }>
                                        <li class="link">
                                            <a href="injectables/UsuariosService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuariosService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/LoginController.html" data-type="entity-link" >LoginController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MedicoController.html" data-type="entity-link" >MedicoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReservasController.html" data-type="entity-link" >ReservasController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsuarioController.html" data-type="entity-link" >UsuarioController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Medico.html" data-type="entity-link" >Medico</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Reserva.html" data-type="entity-link" >Reserva</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Usuario.html" data-type="entity-link" >Usuario</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Usuario-1.html" data-type="entity-link" >Usuario</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Usuario-2.html" data-type="entity-link" >Usuario</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateMedicoDto.html" data-type="entity-link" >CreateMedicoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReservasDto.html" data-type="entity-link" >CreateReservasDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUsuarioDto.html" data-type="entity-link" >CreateUsuarioDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListAdministradorDTO.html" data-type="entity-link" >ListAdministradorDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListMedicoDTO.html" data-type="entity-link" >ListMedicoDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListPacienteDTO.html" data-type="entity-link" >ListPacienteDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListReservasDTO.html" data-type="entity-link" >ListReservasDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListUsuarioDTO.html" data-type="entity-link" >ListUsuarioDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link" >LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicoDTO.html" data-type="entity-link" >MedicoDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReservaDTO.html" data-type="entity-link" >ReservaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMedicoDto.html" data-type="entity-link" >UpdateMedicoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateReservasDto.html" data-type="entity-link" >UpdateReservasDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUsuarioDto.html" data-type="entity-link" >UpdateUsuarioDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MedicoService.html" data-type="entity-link" >MedicoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReservasService.html" data-type="entity-link" >ReservasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuarioService.html" data-type="entity-link" >UsuarioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuariosService.html" data-type="entity-link" >UsuariosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuariosService-1.html" data-type="entity-link" >UsuariosService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
