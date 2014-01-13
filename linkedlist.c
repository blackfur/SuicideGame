/* linkedlist.c */
#include <stdlib.h>
#include "linkedlist.h"

struct node tailsentinel;
struct node headsentinel={0,NULL,&tailsentinel};
struct node tailsentinel={0,&headsentinel,NULL};

static link head = &headsentinel;
static link tail= &tailsentinel;

link make_node(unsigned char item)
{
    link p = malloc(sizeof *p);
    p->item = item;
    p->next = NULL;
    p->prev=NULL;
    return p;
}

void free_node(link p)
{
    free(p);
}

link search(unsigned char key)
{
    link p;
    for (p = head->next; p!=tail; p = p->next)
        if (p->item == key)
            return p;
    return NULL;
}

void insert(link p)
{
    p->next = head->next;
    head->next->prev=p;
    head->next=p;
    p->prev=head;
}
void order_insert(link add){
    link p,pre=head->next;
    for (p = head->next; p!=tail; p = p->next){
        if (p->item >= add->item){
            add->next=p;
            pre->next=add;
            add->prev=pre;
            p->prev=add;
            return ;
        }
        pre=p;
    }
    pre->next=add;
    add->prev=pre;
    add->next=tail;
}

void delete(link p)
{
    p->prev->next=p->next;
    p->next->prev=p->prev;
}

void traverse(void (*visit)(link))
{
    link p;
    for (p = head->next; p!=tail; p = p->next)
        visit(p);
}

void destroy(void)
{
    link q, p = head->next;
    head->next = tail;tail->prev=head;
    while (p!=tail) {
        q = p;
        p = p->next;
        free_node(q);
    }
}

void push(link p)
{
    insert(p);
}

link pop(void)
{
    if(head->next!=tail){
        link p=head->next;
        delete(p);
        return p;
    }
    return NULL;
}
void enqueue(link p){
    insert(p);
}
link dequeue(){
    if(tail->prev==head)
        return NULL;
    link p=tail->prev;
    delete(p);
    return p;
}
void reverse(void){
    tail=head;
    link pre=NULL,current=NULL,p=head;
    while(p){
        current=p;
        p=p->next;
        current->next=pre;
        if(pre)
            pre->prev=current;
        pre=current;
    }
    head=pre;
}
