import Layers from "./layers.class.js";
import Frame from "./elements/frames.class.js";

export default class MenuBar {
    constructor(props) {
        console.log("Navbar loaded");
        this.props = props;
        this.navbar = props.navbar;
        this.createNavbar();
    }

    createNavbar() {
        let elements = [
            {
                icon:  Frame.props.icon,
                name: Frame.props.name,
                event: (e) => {
                    Layers.add(new Frame())
                }
            }
        ];
        let container = document.createElement('div');
        container.classList.add('container');
        for (let element of elements) {
            let anchor = document.createElement('a');
            anchor.title = element.name;
            anchor.innerHTML = element.icon;

            /*let icon = document.createElement('img');
            icon.classList.add('icon');
            icon.width = 30;
            icon.height = 24;
            icon.src = element.icon;
            anchor.append(icon);*/

            anchor.addEventListener('click', element.event)
            container.append(anchor);
        }
        this.navbar.append(container);
    }
}