/* linkedlist.c */
#include <stdlib.h>
#include "linkedlist.h"

static link head = NULL;
static link tail= NULL;

link make_node(unsigned char item)
{
    link p = malloc(sizeof *p);
    p->item = item;
    p->next = NULL;
    return p;
}

void free_node(link p)
{
    free(p);
}

link search(unsigned char key)
{
    link p;
    for (p = head; p; p = p->next)
        if (p->item == key)
            return p;
    return NULL;
}

void insert(link p)
{
    p->next = head;
    head = p;
    if(tail==NULL)tail=p;
}
void order_insert(link add){
    if(head==NULL){
        insert(add);
        return;
    }
    if(head->item>add->item){
        insert(add);
        return;
    }
    link p,pre=head;
    for (p = head; p; p = p->next){
        if (p->item >= add->item){
            add->next=p;
            pre->next=add;
            return ;
        }
        pre=p;
    }
    pre->next=add;
    add->next=NULL;
    tail=add;
}

void delete(link p)
{
    link pre;
    if (p == head) {
        head = p->next;
        return;
    }
    for (pre = head; pre; pre = pre->next)
        if (pre->next == p) {
            pre->next = p->next;
            if(tail==p)tail=pre;
            return;
        }
}

void traverse(void (*visit)(link))
{
    link p;
    for (p = head; p; p = p->next)
        visit(p);
}

void destroy(void)
{
    link q, p = head;
    head = NULL;tail=NULL;
    while (p) {
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
    if (head == NULL)
        return NULL;
    else {
        link p = head;
        if(p==tail)tail=NULL;
        head = head->next;
        return p;
    }
}
void enqueue(link p){
    insert(p);
}
link dequeue(){
    if(tail==NULL)return NULL;
    link p=tail;
    delete(tail);
    return p;
}
void reverse(void){
    if(head==NULL)return;

    tail=head;
    link pre=NULL,current=NULL,p=head;
    while(p){
        current=p;
        p=p->next;
        current->next=pre;
        pre=current;
    }
    head=pre;
}
