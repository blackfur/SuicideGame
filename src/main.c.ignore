/* main.c */
#include <stdio.h>
#include<stdlib.h>
#include "linkedlist.h"

void print_item(link p)
{
    printf("%d ", p->item); 
}

int main(int argc,char *argv[])
{

    if(argc<3){
        printf("usage: %s amount step\n",argv[0]);
        return -1;
    }
    int n=atoi(argv[1]);
    int m=atoi(argv[2]);

    // init
    link p;
    int i=n;
    for(;i>0;i--){
        p=make_node(i); 
        push(p);
    }
    printf("origin: ");
    traverse(print_item);
    printf("\n");

    // game
    link killed=NULL;
    p=NULL; 
    p=next(p); 
    i=1;
    while(n>=m){
        if(i==m){
            printf("kill %d\n",p->item);
            killed=p;
            delete(killed);
            p=next(killed);
            free_node(killed);
            i=1; 
            n--;
            continue;
        }else i++;
        p=next(p); 
    }
    printf("survive: ");
    traverse(print_item);
    printf("\n");

    // clear
    destroy();
    return 0;
}
