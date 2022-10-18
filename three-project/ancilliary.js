// imports go here

// TODO:
// 1. GET number of nodes from html form
// 2. CREATE each node object in an array of size n
// 3.RENDER graphics with circle representing each node


function main() {
  const form  = document.querySelector('#nodesForm');

  form.addEventListener('submitBtn', (event) => {
      // handle the form data
      const n = form.elements['nodeSlider'].value
      console.log("The number of nodes requested is "+n);
      // let nodes = []
      // for (let i=0;i<n;i++) {
      //   nodes.push(new node(i));
      // }
  });
}

main();
