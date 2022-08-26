import { Project, ProjectStatus } from "../models/project";
import { Component } from "./base-component";
import { Autobind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop";
import { projectState } from "../state/project-state";
import { ProjectItem } from "./project-item";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[] = [];

    constructor(private _type: 'active' | 'finished') {
        super('project-list', 'app', false, `${ _type }-projects`);

        this.configure();
        this.renderContent();
    }

    @Autobind
    public dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @Autobind
    public dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId, this._type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @Autobind
    public dragLeaveHandler(_event: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    public configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects: Project[]) => {
            console.log(projects);
            this.assignedProjects = projects.filter(prj => {
                if (this._type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.renderProjects();
        });
    }

    public renderContent() {
        this.element.querySelector('ul')!.id = `${this._type}-projects-list`;
        this.element.querySelector('h2')!.textContent = this._type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this._type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }
}
