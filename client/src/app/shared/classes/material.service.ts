declare var M: { toast: (arg0: { html: string; classes?: string }) => void };

const customStyles = `
  .custom-toast {
    background-color: red;
    color: white;
    border-radius: 20px;
  }
`;

export class MaterialService {
  static toast(message: string) {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = customStyles;
    document.head.appendChild(styleTag);

    M.toast({ html: message, classes: 'custom-toast' });
  }
}
